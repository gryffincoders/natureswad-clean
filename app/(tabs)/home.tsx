// app/(tabs)/home.tsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Animated, 
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  Linking,
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { PRODUCTS } from '../../src/constants/productsData';

import HeaderTemp from '../components/HeaderTemp';
// ✅ IMPORT CART CONTEXT TO GET ITEM COUNT
import { useCart } from '../../src/context/CartContext';

const { width } = Dimensions.get('window');
const API_URL = 'https://natureswad-backend.onrender.com/api';

// --- 1. REUSABLE ANIMATED CARD (Slide Up) ---
const FadeInView = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number, style?: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 600, delay: delay, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, friction: 8, tension: 40, delay: delay, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

// --- 2. BLINKING BADGE COMPONENT ---
const BlinkingBadge = ({ text }: { text: string }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.blinkingBadge, { opacity }]}>
      <Text style={styles.blinkingText}>{text}</Text>
    </Animated.View>
  );
};

// --- 3. PRODUCT CARD — IMAGE CROPPING FIXED ---
const ProductCard = ({ product, router }: { product: any; router: any }) => {
  if (!product) return null;
  const displayImage = product.image || (product.images && product.images[0]);
  
  const rawText = product.name ? product.name.replace(/\//g, '') : '';
  const displayTitle = rawText.split('|')[0].trim();

  const nutritionTags = [];
  if (product.nutritionalInfo) {
    if (product.nutritionalInfo.keyNutrients?.[0]) nutritionTags.push(product.nutritionalInfo.keyNutrients[0].replace(/\//g, ''));
    if (product.nutritionalInfo.healthBenefits?.[0]) nutritionTags.push(product.nutritionalInfo.healthBenefits[0].replace(/\//g, ''));
  }

  return (
    <TouchableOpacity 
      style={styles.zomatoCard} 
      activeOpacity={0.95} 
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.zomatoImageContainer}>
        <Image source={displayImage} style={styles.zomatoImage} resizeMode="contain" />
        
        <TouchableOpacity 
          style={styles.zomatoAddBtn}
          onPress={() => router.push(`/product/${product.id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.zomatoAddText}>ADD</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.zomatoDetails}>
        <Text style={styles.zomatoName} numberOfLines={1}>{displayTitle}</Text>
        <Text style={styles.zomatoPrice}>{product.variants?.[0]?.price || ''}</Text>

        <View style={styles.zomatoTagsContainer}>
          {nutritionTags.slice(0, 2).map((tag, idx) => (
            <View key={idx} style={styles.zomatoTag}>
              <Ionicons name="leaf" size={10} color="#2E7D32" style={{ marginRight: 4 }} />
              <Text style={styles.zomatoTagText} numberOfLines={1}>
                {tag.length > 25 ? tag.substring(0, 25) + '...' : tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter(); 
  
  // ✅ INITIALIZE CART ITEMS
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  const allProducts = Object.values(PRODUCTS);
  
  const heroProduct = PRODUCTS['c1'];
  const cleanHeroDesc = "Seven days of highly nutritious, gluten-free millet breakfasts. 100% natural.";
  
  const youMayAlsoLikeIds = ['h1', 'a2', 'f3', 'p2', 'h5', 's1'];
  const youMayAlsoLikeProducts = youMayAlsoLikeIds.map(id => PRODUCTS[id as keyof typeof PRODUCTS]).filter(Boolean);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const user = auth().currentUser;
      const defaultRecommendations = [PRODUCTS['m1'], PRODUCTS['p1'], PRODUCTS['s2'], PRODUCTS['f6']].filter(Boolean);

      if (!user) {
        setRecommendedProducts(defaultRecommendations);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders/${user.uid}`);
        const pastOrders = await response.json();

        if (response.ok && pastOrders.length > 0) {
          const orderedCategories = new Set<string>();
          const orderedItemIds = new Set<string>();

          pastOrders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
              orderedItemIds.add(item.id);
              if (PRODUCTS[item.id as keyof typeof PRODUCTS]) {
                orderedCategories.add(PRODUCTS[item.id as keyof typeof PRODUCTS].category);
              }
            });
          });

          const tailoredRecommendations = allProducts.filter(p => 
            orderedCategories.has(p.category) && !orderedItemIds.has(p.id)
          );

          if (tailoredRecommendations.length > 0) {
            setRecommendedProducts(tailoredRecommendations.sort(() => 0.5 - Math.random()).slice(0, 5));
          } else {
            setRecommendedProducts(defaultRecommendations); 
          }
        } else {
          setRecommendedProducts(defaultRecommendations);
        }
      } catch (error) {
        console.error("Failed to generate recommendations", error);
        setRecommendedProducts(defaultRecommendations);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(text.toLowerCase()) || 
        (product.category && product.category.toLowerCase().includes(text.toLowerCase()))
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (error) { console.error(error); }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />
      
      <HeaderTemp showBack={false} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* SEARCH BAR */}
        <FadeInView delay={50} style={{ zIndex: 100 }}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <View style={styles.searchIconWrapper}>
                <Ionicons name="search" size={20} color="#F25D23" />
              </View>
              <TextInput 
                style={styles.searchInput}
                placeholder="Search organic millets, healthy breakfast mix..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearIconWrapper}>
                  <Ionicons name="close-circle" size={20} color="#CCC" />
                </TouchableOpacity>
              )}
            </View>

            {suggestions.length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {suggestions.slice(0, 5).map((item, index) => {
                  const thumbImage = item.image || (item.images && item.images[0]);
                  const cleanName = item.name.replace(/\//g, '').split('|')[0].trim();
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[styles.suggestionItem, index === suggestions.length - 1 && { borderBottomWidth: 0 }]}
                      onPress={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        router.push(`/product/${item.id}`);
                      }}
                      activeOpacity={0.7}
                    >
                      <Image source={thumbImage} style={styles.suggestionThumb} resizeMode="contain" />
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionName} numberOfLines={1}>{cleanName}</Text>
                        <Text style={styles.suggestionCategory}>{item.category}</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={16} color="#E0E0E0" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </FadeInView>

        {/* HERO PROMO */}
        <FadeInView delay={150}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => router.push(`/product/${heroProduct.id}`)} style={styles.heroCard}>
            <BlinkingBadge text="ORGANIC BREAKFAST KIT" />
            <View style={styles.heroContent}>
              <View style={styles.heroTextContent}>
                <Text style={styles.promoTitle} numberOfLines={1}>Magic Health Kit</Text>
                <Text style={styles.promoSub} numberOfLines={2}>{cleanHeroDesc}</Text>
                <View style={styles.heroPriceBadge}>
                  <Text style={styles.heroPriceText}>{heroProduct.variants[0].price}</Text>
                </View>
              </View>
              <Image source={heroProduct.images ? heroProduct.images[0] : heroProduct.images[0]} style={styles.heroImage} resizeMode="contain"/>
            </View>
            <View style={styles.heroGradientOverlay} />
          </TouchableOpacity>
        </FadeInView>

        {/* BUY ORGANIC FOOD ONLINE */}
        {recommendedProducts.length > 0 && (
          <FadeInView delay={250}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Buy Organic Food Online</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recommendedProducts}
              renderItem={({ item }) => <ProductCard product={item} router={router} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              snapToInterval={220 + 16}
              decelerationRate="fast"
            />
          </FadeInView>
        )}

        {/* DIABETIC FRIENDLY FOODS */}
        <FadeInView delay={350}>
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Diabetic Friendly Foods</Text>
          </View>
          <FlatList
            data={youMayAlsoLikeProducts}
            renderItem={({ item }) => <ProductCard product={item} router={router} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            snapToInterval={220 + 16}
            decelerationRate="fast"
          />
        </FadeInView>

        {/* WHY NATURESWAD */}
        <FadeInView delay={450} style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Why Natureswad?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoScrollContent}>
            <View style={styles.premiumInfoCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}><Ionicons name="leaf" size={24} color="#2E7D32" /></View>
              <Text style={styles.infoCardTitle}>100% Pure Organic</Text>
              <Text style={styles.infoCardDesc}>Chemical free food products sourced directly from farms.</Text>
            </View>
            <View style={styles.premiumInfoCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}><Ionicons name="heart-outline" size={24} color="#1565C0" /></View>
              <Text style={styles.infoCardTitle}>Diabetic Friendly</Text>
              <Text style={styles.infoCardDesc}>Low GI ancient grains and best millets for diabetes.</Text>
            </View>
            <View style={styles.premiumInfoCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}><Ionicons name="shield-checkmark" size={24} color="#C62828" /></View>
              <Text style={styles.infoCardTitle}>Zero Preservatives</Text>
              <Text style={styles.infoCardDesc}>No chemicals, no artificial colors. Natural groceries only.</Text>
            </View>
          </ScrollView>
        </FadeInView>

        {/* JOIN NETWORK BANNER */}
        <FadeInView delay={550}>
          <TouchableOpacity style={styles.bannerCard} activeOpacity={0.9} onPress={() => router.push('/components/ContactUs')}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Join Our Network</Text>
              <Text style={styles.bannerDesc}>Addressing specific nutritional needs with customized diet & lifestyle realignments across India.</Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Get In Touch</Text>
                <Ionicons name="arrow-forward" size={16} color="#2E7D32" />
              </View>
            </View>
            <Ionicons name="medical" size={80} color="rgba(46, 125, 50, 0.1)" style={styles.bannerBgIcon} />
          </TouchableOpacity>
        </FadeInView>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <View style={styles.footerTopWave} />
          <Text style={styles.footerBrand}>NATURESWAD</Text>
          <Text style={styles.footerTagline}>Buy Natural Groceries Online | Wholesome Goodness, Naturally.</Text>
          <View style={styles.footerDivider} />
          <View style={styles.socialIconsRow}>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink('https://www.instagram.com/')}><Ionicons name="logo-instagram" size={20} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink('https://www.facebook.com/')}><Ionicons name="logo-facebook" size={20} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink('mailto:sales@natureswad.com')}><Ionicons name="mail" size={20} color="#fff" /></TouchableOpacity>
          </View>
          <Text style={styles.copyrightText}>© 2026 Natureswad Foods. All rights reserved.</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ✅ FLOATING SHOPPING BAG BUTTON */}
      <TouchableOpacity 
        style={styles.floatingCartBtn}
        activeOpacity={0.9}
        onPress={() => router.push('/components/ShoppingBag')} // <-- Change this if your path is different
      >
        <Ionicons name="bag-handle" size={26} color="#fff" />
        
        {/* Show Badge if cart has items */}
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 200, left: -150 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  searchContainer: { marginHorizontal: 16, marginTop: 12, zIndex: 100 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 54, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  searchIconWrapper: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500', height: '100%' },
  clearIconWrapper: { padding: 8 },
  
  suggestionsDropdown: { position: 'absolute', top: 60, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 10, zIndex: 100, borderWidth: 1, borderColor: '#F0F0F0' },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  suggestionThumb: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F8F9FA', marginRight: 12 },
  suggestionTextContainer: { flex: 1, justifyContent: 'center' },
  suggestionName: { fontSize: 14, color: '#333', fontWeight: '600', marginBottom: 2 },
  suggestionCategory: { fontSize: 11, color: '#888', fontWeight: '500' },

  heroCard: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#1B5E20', borderRadius: 24, height: 180, overflow: 'hidden', shadowColor: '#1B5E20', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  heroContent: { flexDirection: 'row', height: '100%', padding: 20, justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  heroTextContent: { flex: 1, marginRight: 10 },
  promoTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  promoSub: { fontSize: 13, color: '#C8E6C9', lineHeight: 18, marginBottom: 12 },
  heroPriceBadge: { backgroundColor: '#F25D23', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  heroPriceText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  heroImage: { width: 130, height: 130, borderRadius: 16 },
  heroGradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 1 },

  blinkingBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  blinkingText: { color: '#fff', fontWeight: '800', fontSize: 10, letterSpacing: 1 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5, marginLeft: 16 },
  seeAllText: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },

  productsList: { paddingLeft: 16, paddingRight: 8 },

  zomatoCard: { width: 210, backgroundColor: '#fff', borderRadius: 20, marginRight: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  zomatoImageContainer: { height: 155, width: '100%', backgroundColor: '#F5F7F5', borderTopLeftRadius: 20, borderTopRightRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  zomatoImage: { width: '88%', height: '88%' },
  zomatoAddBtn: { position: 'absolute', bottom: -14, alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 28, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 5, zIndex: 10 },
  zomatoAddText: { color: '#2E7D32', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  zomatoDetails: { padding: 14, paddingTop: 22 },
  zomatoName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  zomatoPrice: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 10 },
  zomatoTagsContainer: { gap: 6 },
  zomatoTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  zomatoTagText: { fontSize: 10, color: '#2E7D32', fontWeight: '700' },

  infoScrollContent: { paddingLeft: 16, paddingRight: 8, marginTop: 16 },
  premiumInfoCard: { width: 160, backgroundColor: '#fff', borderRadius: 20, padding: 16, marginRight: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  infoCardTitle: { fontSize: 15, fontWeight: '800', color: '#222', marginBottom: 8 },
  infoCardDesc: { fontSize: 12, color: '#666', lineHeight: 18 },

  bannerCard: { marginHorizontal: 16, marginTop: 32, marginBottom: 20, backgroundColor: '#E8F5E9', borderRadius: 24, padding: 24, flexDirection: 'row', overflow: 'hidden' },
  bannerTextContainer: { flex: 1, zIndex: 2 },
  bannerTitle: { fontSize: 20, fontWeight: '800', color: '#1B5E20', marginBottom: 8 },
  bannerDesc: { fontSize: 13, color: '#444', lineHeight: 20, marginBottom: 16 },
  bannerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  bannerButtonText: { fontSize: 13, fontWeight: '800', color: '#2E7D32', marginRight: 6 },
  bannerBgIcon: { position: 'absolute', right: -10, bottom: -10, zIndex: 1, transform: [{ rotate: '-15deg' }] },

  footerContainer: { backgroundColor: '#1B5E20', borderRadius: 24, padding: 30, alignItems: 'center', marginTop: 20, marginHorizontal: 16 },
  footerTopWave: { width: 40, height: 4, backgroundColor: '#4CAF50', borderRadius: 2, marginBottom: 20 },
  footerBrand: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  footerTagline: { fontSize: 12, color: '#AED581', fontStyle: 'italic', marginBottom: 20 },
  footerDivider: { width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  socialIconsRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  socialButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  copyrightText: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },

  // ✅ FLOATING BUTTON STYLES
  floatingCartBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    zIndex: 1000,
  },
  cartBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: '#F25D23',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1B5E20', // Matches the button background for a cutout effect
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});