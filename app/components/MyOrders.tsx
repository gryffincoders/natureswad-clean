import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image, KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import HeaderTemp from './HeaderTemp';

const API_URL = 'https://natureswad-backend.onrender.com/api';

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>{children}</Animated.View>;
};

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');
  const [hasSearchedGuest, setHasSearchedGuest] = useState(false);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      fetchOrders(user.uid);
    } else {
      setIsGuest(true);
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (fetchId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders/${fetchId}`);
      const data = await response.json();
      if (response.ok) {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setHasSearchedGuest(true);
    }
  };

  const handleGuestSearch = () => {
    Keyboard.dismiss();
    if (guestPhone.trim().length === 10) {
      fetchOrders(guestPhone.trim());
    } else {
      alert("Please enter a valid 10-digit number.");
    }
  };

  const getStatusIndex = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('out for delivery')) return 2;
    if (s.includes('packed')) return 1;
    return 0;
  };

  const trackingSteps = ["Placed", "Packed", "On Way", "Delivered"];

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />
      <HeaderTemp showBack={true} />

      {isGuest && !hasSearchedGuest ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.guestContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.guestCard}>
                <View style={styles.guestIconContainer}>
                  <View style={styles.guestIconCircle}>
                    <Ionicons name="search-outline" size={50} color="#1B5E20" />
                  </View>
                </View>
                
                <Text style={styles.guestTitle}>Track Your Order</Text>
                <Text style={styles.guestSubtitle}>
                  Enter the mobile number you used during checkout to track your orders
                </Text>
                
                <View style={styles.guestInputWrapper}>
                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCode}>
                      <Text style={styles.countryCodeText}>+91</Text>
                    </View>
                    <TextInput 
                      style={styles.guestInput}
                      placeholder="98765 43210"
                      placeholderTextColor="#B8C5B8"
                      value={guestPhone} 
                      onChangeText={setGuestPhone} 
                      keyboardType="phone-pad" 
                      maxLength={10}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.guestButton, (!guestPhone || guestPhone.length !== 10) && styles.guestButtonDisabled]} 
                  onPress={handleGuestSearch} 
                  activeOpacity={0.8}
                  disabled={loading || guestPhone.length !== 10}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                      <Text style={styles.guestButtonText}>Track My Orders</Text>
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.guestFooter}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#8BA88B" />
                  <Text style={styles.guestFooterText}>Your order details are secure</Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <FadeInView delay={50}>
            <View style={styles.headerRow}>
              <Text style={styles.pageTitle}>My Orders</Text>
              <Text style={styles.itemCountText}>{orders.length} Orders</Text>
            </View>
          </FadeInView>

          {orders.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="receipt-outline" size={60} color="#C8E6C9" />
              </View>
              <Text style={styles.emptyTitle}>No Orders Found</Text>
              <Text style={styles.emptySubtitle}>
                {isGuest ? "No orders found for this number" : "You haven't placed any orders yet"}
              </Text>
              <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)/products')}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            orders.map((order, index) => {
              const currentIndex = getStatusIndex(order.status);
              const isDelivered = currentIndex === 3;

              return (
                <FadeInView key={order._id} delay={100 * index}>
                  <View style={styles.orderCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.orderIdText}>#{order._id.slice(-8).toUpperCase()}</Text>
                        <Text style={styles.dateText}>{new Date(order.createdAt).toDateString()}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: isDelivered ? '#E8F5E9' : '#FFF3E0' }]}>
                        <Text style={[styles.statusText, { color: isDelivered ? '#2E7D32' : '#E65100' }]}>
                          {order.status || 'Placed'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.divider} />

                    <View style={styles.trackerContainer}>
                      <View style={styles.trackerLine} />
                      {trackingSteps.map((step, i) => (
                        <View key={i} style={styles.trackerStep}>
                          <View style={[styles.trackerCircle, i <= currentIndex && styles.trackerCircleActive]} />
                          <Text style={[styles.trackerStepText, i <= currentIndex && styles.trackerStepTextActive]}>{step}</Text>
                        </View>
                      ))}
                    </View>

                    {isDelivered && (
                      <View style={styles.deliveredBadge}>
                        <Text style={styles.deliveredBadgeText}>✅ Delivered Successfully</Text>
                      </View>
                    )}

                    <View style={styles.divider} />
                    
                    {order.items?.map((item: any, i: number) => (
                      <View key={i} style={styles.itemRow}>
                        <View style={styles.itemImageWrapper}>
                          {item.image ? <Image source={item.image} style={styles.itemImage} resizeMode="contain" /> : <Ionicons name="leaf" size={20} color="#A5D6A7" />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.itemPrice}>₹{item.price}</Text> 
                        </View>
                        <View style={styles.qtyBadge}>
                          <Text style={styles.qtyBadgeText}>x{item.quantity}</Text>
                        </View>
                      </View>
                    ))}
                    
                    <View style={styles.dividerDashed} />
                    
                    <View style={styles.cardFooter}>
                      <View>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalValue}>₹{order.total?.toFixed(2)}</Text>
                      </View>
                      <TouchableOpacity style={styles.reorderButton} onPress={() => router.push('/(tabs)/products')}>
                        <Text style={styles.reorderText}>Buy Again</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </FadeInView>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F9FBFA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.2, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },
  
  keyboardView: { flex: 1 },
  guestContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: Platform.OS === 'ios' ? '100%' : '100%',
  },
  guestCard: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  guestIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  guestIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  guestSubtitle: {
    fontSize: 15,
    color: '#637D63',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  guestInputWrapper: {
    marginBottom: 28,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F7',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5ECE5',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#EEF4EE',
    borderRightWidth: 1,
    borderRightColor: '#E5ECE5',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
  },
  guestInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    backgroundColor: '#F7F9F7',
    letterSpacing: 0.5,
  },
  guestButton: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
  },
  guestButtonDisabled: {
    backgroundColor: '#C8E0C8',
    opacity: 0.7,
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  guestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
  },
  guestFooterText: {
    fontSize: 12,
    color: '#8BA88B',
    fontWeight: '500',
  },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },
  itemCountText: { fontSize: 13, color: '#7C807D', fontWeight: '700' },
  
  orderCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderIdText: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  dateText: { fontSize: 12, color: '#9BA19D', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  
  divider: { height: 1, backgroundColor: '#F0F3F0', marginVertical: 15 },
  dividerDashed: { height: 1, borderWidth: 1, borderColor: '#F0F3F0', borderStyle: 'dashed', marginVertical: 15 },
  
  trackerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, position: 'relative' },
  trackerLine: { position: 'absolute', top: 7, left: '12%', right: '12%', height: 2, backgroundColor: '#F0F3F0', zIndex: -1 },
  trackerStep: { flex: 1, alignItems: 'center' },
  trackerCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F0F3F0', borderWidth: 3, borderColor: '#FFF' },
  trackerCircleActive: { backgroundColor: '#1B5E20' },
  trackerStepText: { fontSize: 8, color: '#A0A5A1', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 },
  trackerStepTextActive: { color: '#1B5E20' },
  
  deliveredBadge: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  deliveredBadgeText: { color: '#2E7D32', fontWeight: '900', fontSize: 12 },

  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemImageWrapper: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#F4F7F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemImage: { width: '70%', height: '70%' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  itemPrice: { fontSize: 13, color: '#1B5E20', fontWeight: '800' },
  qtyBadge: { backgroundColor: '#F4F7F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  qtyBadgeText: { fontSize: 11, fontWeight: '900', color: '#1B5E20' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 10, color: '#888', fontWeight: '800', textTransform: 'uppercase' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#1B5E20' },
  reorderButton: { backgroundColor: '#1B5E20', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  reorderText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#637D63', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  shopButton: { backgroundColor: '#1B5E20', width: '100%', alignItems: 'center', paddingVertical: 18, borderRadius: 16 },
  shopButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});