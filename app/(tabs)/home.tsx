// app/(tabs)/home.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import { PRODUCTS, slugify } from '../../src/constants/productsData';
import HeaderTemp from '../components/HeaderTemp';
import { useCart } from '../../src/context/CartContext';

const { width } = Dimensions.get('window');

const FadeInView = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number, style?: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

const BlinkingBadge = ({ text }: { text: string }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.blinkingBadge, { opacity }]}>
      <Text style={styles.blinkingText}>{text}</Text>
    </Animated.View>
  );
};

const ProductCard = ({ product, router }: { product: any; router: any }) => {
  if (!product) return null;
  const displayImage = product.image || (product.images && product.images[0]);
  const displayTitle = product.name.split('|')[0].trim();

  return (
    <TouchableOpacity 
      style={styles.zomatoCard} 
      activeOpacity={0.95} 
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.zomatoImageContainer}>
        {displayImage ? (
          <Image source={displayImage} style={styles.zomatoImage} resizeMode="contain" />
        ) : (
          <Ionicons name="leaf" size={40} color="#E0E0E0" />
        )}
        <TouchableOpacity 
          style={styles.zomatoAddBtn}
          onPress={() => router.push(`/product/${product.id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.zomatoAddText}>VIEW</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.zomatoDetails}>
        <Text style={styles.zomatoName} numberOfLines={1}>{displayTitle}</Text>
        <Text style={styles.zomatoPrice}>{product.variants?.[0]?.price || 'N/A'}</Text>
        <View style={styles.zomatoTag}>
          <Ionicons name="sparkles" size={10} color="#2E7D32" style={{ marginRight: 4 }} />
          <Text style={styles.zomatoTagText} numberOfLines={1}>{product.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter(); 
  const { cartItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [preferredProducts, setPreferredProducts] = useState<any[]>([]);

  const allProducts = useMemo(() => Object.values(PRODUCTS), []);
  const heroProduct = PRODUCTS['kit_family_weekly'] || allProducts[0];

  useEffect(() => {
    // 1. EXTRACT EXACTLY ONE UNIQUE PREVIEW PRODUCT PER CATEGORY (PREVENTS ACCIDENTAL SHOP BLOCKS)
    const categorySeen = new Set();
    const uniqueCategoryPreviews: any[] = [];
    const usedProductIds = new Set([heroProduct?.id]);

    allProducts.forEach(product => {
      if (product.id === 'kit_family_weekly') return;

      if (!categorySeen.has(product.category)) {
        categorySeen.add(product.category);
        uniqueCategoryPreviews.push(product);
        usedProductIds.add(product.id); // Blacklist from section 2 row lookup
      }
    });
    setRecommendedProducts(uniqueCategoryPreviews);

    // 2. RETRIEVE CROSS-CATEGORY RECOMMENDATIONS WITHOUT ANY ROW DUPLICATIONS
    const remainingInventoryPool = allProducts.filter(p => !usedProductIds.has(p.id));
    
    let preferredMatches = remainingInventoryPool.filter(product => {
      const nameLower = product.name.toLowerCase();
      const descLower = product.description?.toLowerCase() || '';
      return (
        nameLower.includes('diabetic') || 
        nameLower.includes('sugar') || 
        descLower.includes('gluten-free') || 
        descLower.includes('fiber')
      );
    });

    if (preferredMatches.length < 4) {
      const fillerItems = remainingInventoryPool.filter(item => !preferredMatches.some(p => p.id === item.id));
      preferredMatches = [...preferredMatches, ...fillerItems];
    }

    setPreferredProducts(preferredMatches.slice(0, 5));
  }, [allProducts, heroProduct]);

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

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />
      
      <HeaderTemp showBack={false} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* SEARCH CORE */}
        <FadeInView delay={50} style={{ zIndex: 100 }}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#2E7D32" style={{ marginRight: 12 }} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search organic millets, high fiber mixes..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Ionicons name="close-circle" size={20} color="#CCC" />
                </TouchableOpacity>
              )}
            </View>

            {suggestions.length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {suggestions.slice(0, 5).map((item) => {
                  const thumbImage = item.image || (item.images && item.images[0]);
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        router.push(`/product/${item.id}`);
                      }}
                    >
                      <Image source={thumbImage} style={styles.suggestionThumb} resizeMode="contain" />
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionName} numberOfLines={1}>{item.name.split('|')[0]}</Text>
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

        {/* HERO SYSTEM PACK PREVIEW */}
        {heroProduct && (
          <FadeInView delay={120}>
            <TouchableOpacity activeOpacity={0.95} onPress={() => router.push(`/product/${heroProduct.id}`)} style={styles.heroCard}>
              <BlinkingBadge text="FAMILY WEEKLY KIT" />
              <View style={styles.heroContent}>
                <View style={styles.heroTextContent}>
                  <Text style={styles.promoTitle} numberOfLines={1}>Magic Breakfast Kit</Text>
                  <Text style={styles.promoSub} numberOfLines={2}>{heroProduct.description}</Text>
                  <View style={styles.heroPriceBadge}>
                    <Text style={styles.heroPriceText}>{heroProduct.variants?.[0]?.price || '₹1299.00'}</Text>
                  </View>
                </View>
                <Image source={heroProduct.images[0]} style={styles.heroImage} resizeMode="contain"/>
              </View>
            </TouchableOpacity>
          </FadeInView>
        )}

        {/* RENDER SHELF SECTION 1 */}
        {recommendedProducts.length > 0 && (
          <FadeInView delay={200}>
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
              snapToInterval={210 + 16}
              decelerationRate="fast"
            />
          </FadeInView>
        )}

        {/* RENDER SHELF SECTION 2 (NON-OVERLAPPING MATCHES) */}
        {preferredProducts.length > 0 && (
          <FadeInView delay={300}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Diabetic Friendly & Gluten Free Foods</Text>
            </View>
            <FlatList
              data={preferredProducts}
              renderItem={({ item }) => <ProductCard product={item} router={router} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              snapToInterval={210 + 16}
              decelerationRate="fast"
            />
          </FadeInView>
        )}

        {/* ECO TRUST FOOTPRINT BLOCKS */}
        <View style={styles.trustContainer}>
          <Text style={styles.sectionTitle}>Why Natureswad?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoScrollContent}>
            <View style={styles.premiumInfoCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}><Ionicons name="leaf" size={22} color="#2E7D32" /></View>
              <Text style={styles.infoCardTitle}>100% Pure Organic</Text>
              <Text style={styles.infoCardDesc}>Chemical free foods sourced directly from farms.</Text>
            </View>
            <View style={styles.premiumInfoCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}><Ionicons name="heart-outline" size={22} color="#1565C0" /></View>
              <Text style={styles.infoCardTitle}>Diabetic Friendly</Text>
              <Text style={styles.infoCardDesc}>Low GI grains and best millets for diabetes support.</Text>
            </View>
            <View style={styles.premiumInfoCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}><Ionicons name="shield-checkmark" size={22} color="#C62828" /></View>
              <Text style={styles.infoCardTitle}>Zero Preservatives</Text>
              <Text style={styles.infoCardDesc}>No chemicals, no palm oils. 100% natural groceries.</Text>
            </View>
          </ScrollView>
        </View>

        {/* INTERACTIVE BANNER FRAME */}
        <TouchableOpacity style={styles.bannerCard} activeOpacity={0.9} onPress={() => router.push('/components/ContactUs')}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Join Our Network</Text>
            <Text style={styles.bannerDesc}>Addressing specific nutritional needs across pan-India regions layout.</Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Get In Touch</Text>
              <Ionicons name="arrow-forward" size={14} color="#2E7D32" />
            </View>
          </View>
        </TouchableOpacity>

        {/* FOOTER BASAL LAYER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerBrand}>NATURESWAD</Text>
          <Text style={styles.footerTagline}>Wholesome Goodness, Naturally.</Text>
          <Text style={styles.copyrightText}>© 2026 Natureswad Foods. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* FLOATING ACTION CART OVERLAY TRIGGER */}
      <TouchableOpacity style={styles.floatingCartBtn} activeOpacity={0.9} onPress={() => router.push('/components/ShoppingBag')}>
        <Ionicons name="bag-handle" size={24} color="#fff" />
        {cartItems.length > 0 && (
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartItems.length}</Text></View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.2 },
  blob1: { width: 350, height: 350, backgroundColor: '#E8F5E9', top: -80, right: -120 },

  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 150, left: -160 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  searchContainer: { marginHorizontal: 16, marginTop: 12, zIndex: 100 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 54, borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  suggestionsDropdown: { position: 'absolute', top: 60, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 8, elevation: 6, zIndex: 100, borderWidth: 1, borderColor: '#F0F0F0' },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 },
  suggestionThumb: { width: 36, height: 36, borderRadius: 6, marginRight: 12, backgroundColor: '#F5F5F5' },
  suggestionTextContainer: { flex: 1 },
  suggestionName: { fontSize: 14, color: '#333', fontWeight: '600' },
  suggestionCategory: { fontSize: 11, color: '#888' },
  heroCard: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#1B5E20', borderRadius: 24, height: 170, overflow: 'hidden', elevation: 4 },
  heroContent: { flexDirection: 'row', height: '100%', padding: 20, alignItems: 'center' },
  heroTextContent: { flex: 1, marginRight: 12 },
  promoTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 },
  promoSub: { fontSize: 13, color: '#C8E6C9', lineHeight: 18, marginBottom: 12 },
  heroPriceBadge: { backgroundColor: '#F25D23', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  heroPriceText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  heroImage: { width: 110, height: 110 },
  blinkingBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  blinkingText: { color: '#fff', fontWeight: '800', fontSize: 9, letterSpacing: 0.5 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  seeAllText: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },
  productsList: { paddingLeft: 16, paddingVertical: 12 },
  zomatoCard: { width: 210, backgroundColor: '#fff', borderRadius: 20, marginRight: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', elevation: 3 },
  zomatoImageContainer: { height: 140, width: '100%', backgroundColor: '#F8F9FA', borderTopLeftRadius: 20, borderTopRightRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  zomatoImage: { width: '85%', height: '85%' },
  zomatoAddBtn: { position: 'absolute', bottom: -14, alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#E8E8E8', elevation: 3 },
  zomatoAddText: { color: '#2E7D32', fontWeight: '900', fontSize: 12 },
  zomatoDetails: { padding: 12, paddingTop: 18 },
  zomatoName: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  zomatoPrice: { fontSize: 14, fontWeight: '700', color: '#1B5E20', marginBottom: 6 },
  zomatoTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  zomatoTagText: { fontSize: 9, color: '#2E7D32', fontWeight: '700' },
  trustContainer: { marginTop: 20, paddingHorizontal: 16 },
  infoScrollContent: { paddingVertical: 12 },
  premiumInfoCard: { width: 160, backgroundColor: '#fff', borderRadius: 20, padding: 14, marginRight: 14, elevation: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  infoCardTitle: { fontSize: 14, fontWeight: '800', color: '#222', marginBottom: 4 },
  infoCardDesc: { fontSize: 11, color: '#666', lineHeight: 16 },
  bannerCard: { marginHorizontal: 16, marginTop: 24, backgroundColor: '#E8F5E9', borderRadius: 24, padding: 20 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#1B5E20', marginBottom: 4 },
  bannerDesc: { fontSize: 13, color: '#444', lineHeight: 18, marginBottom: 12 },
  bannerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  bannerButtonText: { fontSize: 12, fontWeight: '800', color: '#2E7D32', marginRight: 4 },
  footerContainer: { backgroundColor: '#1B5E20', borderRadius: 24, padding: 24, alignItems: 'center', marginHorizontal: 16, marginTop: 12 },
  footerBrand: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  footerTagline: { fontSize: 12, color: '#C8E6C9', fontStyle: 'italic', marginTop: 2, marginBottom: 12 },
  copyrightText: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  floatingCartBtn: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#1B5E20', justifyContent: 'center', alignItems: 'center', elevation: 6, zIndex: 999 },
  cartBadge: { position: 'absolute', top: 8, right: 10, backgroundColor: '#F25D23', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#1B5E20' },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' }
});