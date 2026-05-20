import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
  Alert, Dimensions, Platform, TextInput, Animated 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../src/context/CartContext';
import { PRODUCTS } from '../../src/constants/productsData';

// Import the Header
import HeaderTemp from './HeaderTemp';

const { width } = Dimensions.get('window');

// --- REUSABLE ANIMATED COMPONENT ---
const FadeInView = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

export default function ShoppingBag() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { cartItems, removeFromCart, updateQuantity, cartTotal, addToCart } = useCart();
  
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const discount = promoCode === 'NATURE10' ? cartTotal * 0.1 : 0;
  const finalTotal = cartTotal - discount;

  const handleQuickAdd = (product: any) => {
    const imageSource = product.image || (product.images && product.images[0]);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.variants?.[0]?.price || product.price,
      image: imageSource,
      quantity: 1,
      weight: product.variants?.[0]?.label || 'Standard'
    });
    Alert.alert('Added!', `${product.name} added to bag`, [{ text: 'OK' }]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Bag', 'Add some products before checkout');
      return;
    }
    router.push('/components/CheckoutScreen');
  };

  const handleRemoveItem = (id: string, weight: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id, weight) }
      ]
    );
  };

  const getCartItemImage = (item: any) => {
    if (item.image) return item.image;
    const productData = PRODUCTS[item.id as keyof typeof PRODUCTS];
    if (productData) {
      // @ts-ignore
      return productData.image || (productData.images && productData.images[0]);
    }
    return null;
  };

  const renderCartItem = (item: any, index: number) => (
    <FadeInView key={`${item.id}-${item.weight}-${index}`} delay={50 + (index * 100)}>
      <View style={styles.cartItemCard}>
        <View style={styles.itemImageWrapper}>
          <Image 
            source={getCartItemImage(item)} 
            style={styles.itemImage} 
            resizeMode="contain" 
          />
          <View style={styles.imageOverlay} />
        </View>
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemWeight}>{item.weight}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.weight)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>

          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>{item.price}</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => item.quantity > 1 ? updateQuantity(item.id, item.weight, item.quantity - 1) : removeFromCart(item.id, item.weight)}
                style={styles.qtyButton}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={16} color={item.quantity === 1 ? "#999" : "#1B5E20"} />
              </TouchableOpacity>
              
              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyText}>{item.quantity}</Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => updateQuantity(item.id, item.weight, item.quantity + 1)} 
                style={styles.qtyButton}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={16} color="#1B5E20" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </FadeInView>
  );

  const renderSuggestion = (productId: string) => {
    const product = PRODUCTS[productId as keyof typeof PRODUCTS];
    if (!product) return null; // Returns null if product is not found
    const displayImage = (product as any).image || (product as any).images?.[0];

    return (
      <View style={styles.suggestionCard}>
        <View style={styles.suggestionImageWrapper}>
          <Image source={displayImage} style={styles.suggestionImage} resizeMode="contain" />
        </View>
        <View style={styles.suggestionDetails}>
          <Text style={styles.suggestionName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.suggestionCategory}>{product.category}</Text>
          <View style={styles.suggestionPriceRow}>
            <Text style={styles.suggestionPrice}>₹{product.variants?.[0]?.price?.replace('₹', '') || 'N/A'}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleQuickAdd(product)} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <FadeInView delay={100} style={{ flex: 1 }}>
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <Ionicons name="cart" size={80} color="#2E7D32" />
        </View>
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={styles.emptySubtitle}>Looks like you haven't added any premium health products to your bag yet.</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)/products')} activeOpacity={0.8}>
          <Text style={styles.shopButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    </FadeInView>
  );

  return (
    <View style={styles.mainContainer}>
      {/* --- AMBIENT SUBTLE BACKGROUND BLOBS --- */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, cartItems.length === 0 && styles.emptyScrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length > 0 ? (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.pageTitle}>Shopping Bag</Text>
              <Text style={styles.itemCountText}>{cartItems.length} Items</Text>
            </View>

            <View style={styles.cartItemsSection}>
              {cartItems.map((item, index) => renderCartItem(item, index))}
            </View>

            <FadeInView delay={300}>
              <View style={styles.promoSection}>
                {showPromoInput ? (
                  <View style={styles.promoInputContainer}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Enter promo code"
                      placeholderTextColor="#999"
                      value={promoCode}
                      onChangeText={setPromoCode}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity 
                      style={styles.applyButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (promoCode === 'NATURE10') Alert.alert('Success!', '10% discount applied');
                        else if (promoCode) Alert.alert('Invalid Code', 'The promo code is not valid');
                        setShowPromoInput(false);
                      }}
                    >
                      <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.promoButton} onPress={() => setShowPromoInput(true)} activeOpacity={0.8}>
                    <View style={styles.promoIconRow}>
                      <View style={styles.promoIconBg}>
                        <Ionicons name="ticket-outline" size={18} color="#2E7D32" />
                      </View>
                      <Text style={styles.promoButtonText}>Apply Promo Code</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </FadeInView>

            <FadeInView delay={400}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Bill Details</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item Total</Text>
                  <Text style={styles.summaryValue}>₹{cartTotal.toFixed(2)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount (10%)</Text>
                    <Text style={[styles.summaryValue, styles.discountValue]}>-₹{discount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>FREE</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>To Pay</Text>
                  <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
                </View>
              </View>
            </FadeInView>

            <FadeInView delay={500}>
              <View style={styles.suggestionsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>You may also like</Text>
                </View>
                {/* ✅ Added contentContainerStyle instead of style for correct scroll padding */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.suggestionsScroll}
                >
                  {/* ✅ Used IDs that actually exist in your products list */}
                  {['a1', 'a2', 'h1', 'h3', 'po4'].map((id) => {
                    const content = renderSuggestion(id);
                    // ✅ If product isn't found, do NOT render the wrapper (Fixes the gap bug)
                    if (!content) return null; 
                    return (
                      <View key={id} style={styles.suggestionWrapper}>
                        {content}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </FadeInView>
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>

      {/* --- MODERN FLOATING FOOTER --- */}
      {cartItems.length > 0 && (
        <View style={[
          styles.footer, 
          { paddingBottom: Math.max(insets.bottom, 20) + 10 } 
        ]}>
          <View style={styles.footerContent}>
            <View style={styles.footerTotal}>
              <Text style={styles.footerTotalLabel}>PAYING</Text>
              <Text style={styles.footerTotalValue}>₹{finalTotal.toFixed(2)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 20 }}>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.9}>
                <Text style={styles.checkoutButtonText}>Proceed to Pay</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // Ambient Background
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },

  scrollView: { flex: 1, zIndex: 1 },
  scrollContent: { paddingBottom: 160 }, 
  emptyScrollContent: { flexGrow: 1, justifyContent: 'center', paddingBottom: 0 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  itemCountText: { fontSize: 14, color: '#666', fontWeight: '600', paddingBottom: 4 },

  cartItemsSection: { paddingHorizontal: 16 },
  
  // Modern Cart Item Card
  cartItemCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 16, 
    marginBottom: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 10, 
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)'
  },
  itemImageWrapper: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  itemImage: { width: '80%', height: '80%', zIndex: 2 },
  imageOverlay: { position: 'absolute', bottom: 0, width: '100%', height: '30%', backgroundColor: 'rgba(0,0,0,0.03)' },
  
  itemDetails: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameContainer: { flex: 1, marginRight: 8 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', lineHeight: 22 },
  itemWeight: { fontSize: 13, color: '#888', marginTop: 4, fontWeight: '500' },
  deleteButton: { padding: 4, backgroundColor: '#FFEBEE', borderRadius: 12 },
  
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#1B5E20' },
  
  // Pill Shaped Quantity
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9', borderRadius: 20, paddingHorizontal: 4, paddingVertical: 4, borderWidth: 1, borderColor: '#C8E6C9' },
  qtyButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  qtyDisplay: { width: 32, alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },

  // Promo Section
  promoSection: { marginHorizontal: 16, marginTop: 8 },
  promoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, justifyContent: 'space-between' },
  promoIconRow: { flexDirection: 'row', alignItems: 'center' },
  promoIconBg: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center' },
  promoButtonText: { marginLeft: 12, color: '#333', fontSize: 15, fontWeight: '600' },
  promoInputContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  promoInput: { flex: 1, paddingHorizontal: 20, paddingVertical: 16, fontSize: 15, color: '#333', fontWeight: '500' },
  applyButton: { backgroundColor: '#1B5E20', paddingHorizontal: 24, justifyContent: 'center' },
  applyButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Summary Card
  summaryCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 24, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  summaryLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  discountLabel: { color: '#2E7D32' },
  discountValue: { color: '#2E7D32', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F4F8', marginVertical: 16 },
  totalRow: { marginBottom: 0, alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#1B5E20' },

  // Suggestions
  suggestionsSection: { marginTop: 32, paddingLeft: 16 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  suggestionsScroll: { paddingRight: 32 }, // ✅ Ensures padding at the very end of the scroll list
  suggestionWrapper: { marginRight: 16, width: width * 0.45 }, // ✅ Increased slightly to look better on standard screens
  suggestionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' },
  suggestionImageWrapper: { width: '100%', height: 100, borderRadius: 12, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  suggestionImage: { width: '80%', height: '80%' },
  suggestionDetails: { flex: 1 },
  suggestionName: { fontSize: 14, fontWeight: '700', color: '#222', marginBottom: 4, lineHeight: 18 },
  suggestionCategory: { fontSize: 12, color: '#888', marginBottom: 10 },
  suggestionPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  suggestionPrice: { fontSize: 16, fontWeight: '800', color: '#1B5E20' },
  addBtn: { backgroundColor: '#F1F8E9', padding: 6, borderRadius: 12 },

  // Empty State
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconWrapper: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  emptyTitle: { fontSize: 26, fontWeight: '900', color: '#000000', marginBottom: 12, textAlign: 'center' }, 
  emptySubtitle: { fontSize: 16, color: '#333333', textAlign: 'center', lineHeight: 24, marginBottom: 36, fontWeight: '500' }, 
  shopButton: { backgroundColor: '#1B5E20', paddingHorizontal: 36, paddingVertical: 18, borderRadius: 30, shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  shopButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },

  // Floating Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingTop: 24, paddingHorizontal: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 15, zIndex: 1000,
  },
  footerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTotal: { flexShrink: 1 },
  footerTotalLabel: { fontSize: 11, color: '#888', fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  footerTotalValue: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
  checkoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B5E20', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 20, justifyContent: 'center', width: '100%', shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', marginRight: 8, letterSpacing: 0.5 },
});
