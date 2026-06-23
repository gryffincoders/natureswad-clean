// app/screens/CheckoutScreen.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, 
  ActivityIndicator, TextInput, Platform, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import auth from '@react-native-firebase/auth'; 
import HeaderTemp from '../components/HeaderTemp'; 

const API_URL = 'https://natureswad-backend.onrender.com/api';

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, [delay, fadeAnim, slideAnim]);
  return <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>{children}</Animated.View>;
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const insets = useSafeAreaInsets(); 

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online'); 

  // --- REWARDS STATE ---
  const [userPoints, setUserPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const POINTS_REQUIRED_TO_REDEEM = 200;
  const DISCOUNT_VALUE = 200; 
  const POINTS_EARNED_PER_ORDER = 25;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const cleanPhone = phone.replace(/\D/g, '');

  const isAddressValid = 
    name.trim().length > 0 && 
    cleanPhone.length === 10 && 
    address.trim().length > 0 && 
    city.trim().length > 0 && 
    stateName.trim().length > 0 && 
    pincode.trim().length === 6;

  // --- LOAD SAVED ADDRESS ON MOUNT ---
  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const savedAddressString = await AsyncStorage.getItem('@saved_address');
        if (savedAddressString) {
          const savedData = JSON.parse(savedAddressString);
          if (savedData.name) setName(savedData.name);
          if (savedData.phone) setPhone(savedData.phone);
          if (savedData.address) setAddress(savedData.address);
          if (savedData.city) setCity(savedData.city);
          if (savedData.stateName) setStateName(savedData.stateName);
          if (savedData.pincode) setPincode(savedData.pincode);
        }
      } catch (error) {
        console.log("Could not load saved address", error);
      }
    };
    loadSavedAddress();
  }, []);

  // --- AUTO-FILL STATE & CITY FROM PINCODE ---
  useEffect(() => {
    const fetchLocationData = async () => {
      if (pincode.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await response.json();
          
          if (data && data[0] && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            if (postOffice.State) setStateName(postOffice.State);
            if (!city && (postOffice.District || postOffice.Block)) {
              setCity(postOffice.District || postOffice.Block);
            }
          }
        } catch (error) {
          console.log("Could not fetch pincode details", error);
        }
      }
    };
    fetchLocationData();
  }, [pincode, city]);

  // --- FETCH USER POINTS ---
  useEffect(() => {
    const fetchUserPoints = async () => {
      const uid = auth().currentUser?.uid || (cleanPhone.length === 10 ? cleanPhone : null);
      if (!uid) {
        setUserPoints(0);
        setUsePoints(false); 
        return;
      }
      try {
        const response = await fetch(`${API_URL}/user-points/${uid}`);
        if (response.ok) {
          const data = await response.json();
          const pointsFetched = data.points || 0;
          setUserPoints(pointsFetched);
          
          // ✅ Safety parameter reset if they fall below the required threshold mid-session
          if (pointsFetched < POINTS_REQUIRED_TO_REDEEM) {
            setUsePoints(false);
          }
        }
      } catch (error) {
        console.log("Could not fetch points", error);
        setUsePoints(false);
      }
    };
    fetchUserPoints();
  }, [cleanPhone]);

  // --- CALCULATIONS ---
  const subtotal = Number(cartTotal) || 0;
  const shipping = subtotal >= 500 ? 0 : 40;
  const tax = subtotal * 0.05;
  
  // Enforce validation criteria lookup before confirming active deduction values
  const pointsDiscount = (usePoints && userPoints >= POINTS_REQUIRED_TO_REDEEM) ? DISCOUNT_VALUE : 0;
  const total = Math.max(0, subtotal + shipping + tax - pointsDiscount);

  const saveAddressLocally = async () => {
    try {
      const addressData = { name, phone: cleanPhone, address, city, stateName, pincode };
      await AsyncStorage.setItem('@saved_address', JSON.stringify(addressData));
    } catch (error) {
      console.log("Could not save address locally", error);
    }
  };

  const handleCheckout = async () => {
    if (!isAddressValid) {
      Alert.alert('Missing Details', 'Please fill all delivery details correctly (10-digit phone, 6-digit pincode).');
      return;
    }
    if (paymentMethod === 'online') startRazorpayPayment();
    else processCODOrder();
  };

  const getOrderDetails = () => ({
    userId: auth().currentUser?.uid || cleanPhone,
    total: total,
    subtotal: subtotal,
    discountApplied: pointsDiscount,
    pointsRedeemed: pointsDiscount > 0 ? POINTS_REQUIRED_TO_REDEEM : 0,
    pointsEarned: POINTS_EARNED_PER_ORDER,
    items: cartItems,
    address: { name, phone: cleanPhone, address, city, stateName, pincode },
    paymentMethod: paymentMethod === 'online' ? 'Online - Razorpay' : 'Cash on Delivery'
  });

  const startRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const options = {
        description: 'Natureswad Purchase',
        currency: 'INR',
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID, 
        amount: Math.round(total * 100), 
        name: 'Natureswad',
        order_id: data.orderId, 
        prefill: { contact: cleanPhone, name: name },
        theme: { color: '#1B5E20' }
      };

      const paymentData = await RazorpayCheckout.open(options);

      const verifyRes = await fetch(`${API_URL}/verify-and-save-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          orderDetails: getOrderDetails()
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      await saveAddressLocally(); 
      clearCart();
      Alert.alert('Order Placed 🎉', `Payment successful! You earned ${POINTS_EARNED_PER_ORDER} points.`, [{ text: 'View Orders', onPress: () => router.replace('/components/MyOrders') }]);

    } catch (error: any) {
      console.error("Payment Error:", error);
      Alert.alert('Payment Failed', error.description || error.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCODOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/place-cod-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderDetails: getOrderDetails() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await saveAddressLocally(); 
      clearCart();
      Alert.alert('Order Placed 🎉', `COD order confirmed! You earned ${POINTS_EARNED_PER_ORDER} points.`, [{ text: 'View Orders', onPress: () => router.replace('/components/MyOrders') }]);
    } catch (error: any) {
      console.error("COD Error:", error);
      Alert.alert('Order Failed', 'Could not save your order.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />
      <HeaderTemp showBack={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* --- DELIVERY DETAILS --- */}
        <FadeInView delay={50}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}><Ionicons name="location" size={22} color="#1B5E20" /><Text style={styles.sectionTitle}>Delivery Details</Text></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Full Name</Text><TextInput style={styles.input} placeholder="Your Full Name" value={name} onChangeText={setName} placeholderTextColor="#999" editable={!isProcessing} /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Phone Number</Text><TextInput style={styles.input} placeholder="10-digit mobile number" value={phone} onChangeText={setPhone} keyboardType="number-pad" maxLength={10} placeholderTextColor="#999" editable={!isProcessing} /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Complete Address</Text><TextInput style={[styles.input, styles.textArea]} placeholder="House No, Building, Street, Area" value={address} onChangeText={setAddress} multiline numberOfLines={3} textAlignVertical="top" placeholderTextColor="#999" editable={!isProcessing} /></View>
            
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}><Text style={styles.label}>Pincode</Text><TextInput style={styles.input} placeholder="123456" value={pincode} onChangeText={setPincode} keyboardType="number-pad" maxLength={6} placeholderTextColor="#999" editable={!isProcessing} /></View>
              <View style={[styles.inputGroup, { flex: 1 }]}><Text style={styles.label}>City</Text><TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} placeholderTextColor="#999" editable={!isProcessing} /></View>
            </View>

            <View style={styles.inputGroup}><Text style={styles.label}>State</Text><TextInput style={styles.input} placeholder="Your State" value={stateName} onChangeText={setStateName} placeholderTextColor="#999" editable={!isProcessing} /></View>
          </View>
        </FadeInView>

        {/* --- REWARDS SECTION --- */}
        {(auth().currentUser || cleanPhone.length === 10) && (
          <FadeInView delay={100}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star" size={22} color="#F57F17" />
                <Text style={styles.sectionTitle}>Natureswad Rewards</Text>
              </View>
              <Text style={styles.pointsText}>Current Balance: <Text style={{fontWeight: '800'}}>{userPoints}</Text> Points</Text>
              
              {/* ✅ MANUALLY CHOOSE WHETHER TO REDEEM OR SAVE THE POINT UNLOCKED OFFERS */}
              {userPoints >= POINTS_REQUIRED_TO_REDEEM ? (
                <View style={styles.redeemChoicesContainer}>
                  <Text style={styles.redeemIntroText}>🎉 Reward unlocked! Would you like to use it on this purchase?</Text>
                  
                  <View style={styles.optionsFlexRow}>
                    <TouchableOpacity 
                      style={[styles.choicePill, usePoints && styles.choicePillActive]} 
                      onPress={() => !isProcessing && setUsePoints(true)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={usePoints ? "checkmark-circle" : "ellipse-outline"} size={18} color={usePoints ? "#1B5E20" : "#666"} />
                      <Text style={[styles.choiceText, usePoints && styles.choiceTextActive]}>Redeem (-₹{DISCOUNT_VALUE})</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.choicePill, !usePoints && styles.choicePillKeepActive]} 
                      onPress={() => !isProcessing && setUsePoints(false)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={!usePoints ? "bookmark" : "ellipse-outline"} size={16} color={!usePoints ? "#F57F17" : "#666"} />
                      <Text style={[styles.choiceText, !usePoints && styles.choiceTextKeepActive]}>Keep points for later</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.pointsProgressBarBg}>
                  <View style={[styles.pointsProgressBarFill, { width: `${(userPoints / POINTS_REQUIRED_TO_REDEEM) * 100}%` }]} />
                  <Text style={styles.pointsSubText}>Earn {POINTS_REQUIRED_TO_REDEEM - userPoints} more points to unlock a ₹{DISCOUNT_VALUE} reward!</Text>
                </View>
              )}
            </View>
          </FadeInView>
        )}

        {/* --- PAYMENT METHOD --- */}
        <FadeInView delay={150}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}><Ionicons name="wallet" size={22} color="#1B5E20" /><Text style={styles.sectionTitle}>Payment Method</Text></View>
            <TouchableOpacity style={[styles.payOption, paymentMethod === 'online' && styles.payOptionSelected]} onPress={() => !isProcessing && setPaymentMethod('online')} activeOpacity={0.8}>
              <View style={[styles.payIconBg, paymentMethod === 'online' && styles.payIconBgSelected]}><Ionicons name="card" size={20} color={paymentMethod === 'online' ? "#FFF" : "#666"} /></View>
              <View style={{ flex: 1 }}><Text style={[styles.payOptionText, paymentMethod === 'online' && styles.payOptionTextSelected]}>Pay Online</Text><Text style={styles.payOptionSub}>UPI, Credit/Debit Cards</Text></View>
              <Ionicons name={paymentMethod === 'online' ? "radio-button-on" : "radio-button-off"} size={24} color={paymentMethod === 'online' ? "#2E7D32" : "#CCC"} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.payOption, paymentMethod === 'cod' && styles.payOptionSelected]} onPress={() => !isProcessing && setPaymentMethod('cod')} activeOpacity={0.8}>
              <View style={[styles.payIconBg, paymentMethod === 'cod' && styles.payIconBgSelected]}><Ionicons name="cash" size={20} color={paymentMethod === 'cod' ? "#FFF" : "#666"} /></View>
              <View style={{ flex: 1 }}><Text style={[styles.payOptionText, paymentMethod === 'cod' && styles.payOptionTextSelected]}>Cash on Delivery</Text><Text style={styles.payOptionSub}>Pay at doorstep</Text></View>
              <Ionicons name={paymentMethod === 'cod' ? "radio-button-on" : "radio-button-off"} size={24} color={paymentMethod === 'cod' ? "#2E7D32" : "#CCC"} />
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* --- BILL SUMMARY --- */}
        <FadeInView delay={250}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Bill Summary</Text>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Item Total</Text><Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={shipping === 0 ? styles.freeText : styles.summaryValue}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Taxes (5%)</Text><Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text></View>
            
            {pointsDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#F25D23', fontWeight: '700' }]}>Points Discount</Text>
                <Text style={[styles.summaryValue, { color: '#F25D23' }]}>-₹{pointsDiscount.toFixed(2)}</Text>
              </View>
            )}

            <View style={styles.divider} />
            <View style={[styles.summaryRow, { marginBottom: 0 }]}><Text style={styles.totalLabel}>Amount to Pay</Text><Text style={styles.totalValue}>₹{total.toFixed(2)}</Text></View>
            <Text style={styles.earnPointsHint}>You will earn {POINTS_EARNED_PER_ORDER} points on this order!</Text>
          </View>
        </FadeInView>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
        <TouchableOpacity style={[styles.payButton, isProcessing && styles.payButtonDisabled]} onPress={handleCheckout} disabled={isProcessing} activeOpacity={0.9}>
          {isProcessing ? <ActivityIndicator color="#fff" /> : <><Text style={styles.payText}>{paymentMethod === 'online' ? `Pay ₹${total.toFixed(2)}` : `Place COD Order (₹${total.toFixed(2)})`}</Text><Ionicons name="shield-checkmark" size={20} color="#fff" style={{ marginLeft: 8 }} /></>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },
  scrollView: { flex: 1, zIndex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginLeft: 8 },
  
  // Custom Choice Rewards Matrix
  pointsText: { fontSize: 15, color: '#333', marginBottom: 12 },
  redeemChoicesContainer: { marginTop: 8 },
  redeemIntroText: { fontSize: 14, color: '#555', fontWeight: '600', marginBottom: 12 },
  optionsFlexRow: { flexDirection: 'row', gap: 10 },
  choicePill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 14, padding: 12 },
  choicePillActive: { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' },
  choicePillKeepActive: { backgroundColor: '#FFF8E1', borderColor: '#FFE082' },
  choiceText: { fontSize: 13, fontWeight: '700', color: '#666', flex: 1 },
  choiceTextActive: { color: '#1B5E20' },
  choiceTextKeepActive: { color: '#F57F17' },
  redeemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF8E1', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#FFE082' },
  redeemBtnActive: { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' },
  redeemBtnText: { fontSize: 15, fontWeight: '700', color: '#F57F17' },
  redeemBtnTextActive: { color: '#1B5E20' },
  pointsProgressBarBg: { backgroundColor: '#F0F0F0', height: 8, borderRadius: 4, marginTop: 4, position: 'relative', overflow: 'hidden' },
  pointsProgressBarFill: { backgroundColor: '#F25D23', height: '100%', position: 'absolute', left: 0, top: 0 },
  pointsSubText: { fontSize: 12, color: '#888', marginTop: 12, fontWeight: '500', textAlign: 'center' },
  earnPointsHint: { fontSize: 12, color: '#2E7D32', fontWeight: '700', textAlign: 'center', marginTop: 16, backgroundColor: '#E8F5E9', paddingVertical: 6, borderRadius: 8 },

  // Split-Selection Buttons Options
  selectorContainer: { marginBottom: 24 },
  optionsWrapper: { flexDirection: 'row', gap: 12, marginTop: 4 },
  optionChoice: { flex: 1, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 16, padding: 14, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' },
  optionChoiceActive: { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' },
  optionChoiceText: { fontSize: 14, fontWeight: '700', color: '#555' },
  optionChoiceTextActive: { color: '#1B5E20' },

  inputGroup: { marginBottom: 16 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  textArea: { height: 80, paddingTop: 14 },
  payOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#E8E8E8' },
  payOptionSelected: { backgroundColor: '#F1F8E9', borderColor: '#C8E6C9' },
  payIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  payIconBgSelected: { backgroundColor: '#2E7D32' },
  payOptionText: { fontSize: 16, fontWeight: '700', color: '#333' },
  payOptionTextSelected: { color: '#1B5E20' },
  payOptionSub: { fontSize: 12, color: '#888', marginTop: 2, fontWeight: '500' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  summaryValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '700' },
  freeText: { fontSize: 14, fontWeight: '800', color: '#2E7D32' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 14 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#1B5E20' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', zIndex: 10 },
  payButton: { flexDirection: 'row', backgroundColor: '#1B5E20', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#1B5E20', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  payButtonDisabled: { backgroundColor: '#999' },
  payText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});