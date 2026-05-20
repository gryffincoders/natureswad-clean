import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Animated, FlatList, Platform, Share 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderTemp from '../components/HeaderTemp'; 
import { PRODUCTS } from '../../src/constants/productsData'; 
import { useCart } from '../../src/context/CartContext'; 

const { width } = Dimensions.get('window');

// --- REUSABLE ANIMATED COMPONENT ---
const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>{children}</Animated.View>;
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const { addToCart } = useCart(); 
  const insets = useSafeAreaInsets();
  
  // @ts-ignore
  const product = PRODUCTS[id] || PRODUCTS['a1']; 

  const productImages = product.images || [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants ? product.variants[selectedVariantIndex] : null;

  // --- Scroll Handler for Image Carousel ---
  const handleImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price, 
      image: product.image || (product.images && product.images[0]), // ✅ FALLBACK ADDED
      quantity: quantity,
      weight: selectedVariant.label 
    });
    router.push('/components/ShoppingBag');
  };

  // --- SHARE PRODUCT HANDLER ---
  const handleShare = async () => {
    try {
      // Formats a clean message to be sent to WhatsApp, IG, Twitter, etc.
      const shareMessage = `Check out this amazing natural product! 🌿\n\n✨ ${product.name}\n💰 ${selectedVariant?.price || ''}\n\nGet it now on the Natureswad App!`;
      
      const result = await Share.share({
        message: shareMessage,
      });

      if (result.action === Share.sharedAction) {
        console.log('Product shared successfully!');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share sheet dismissed');
      }
    } catch (error: any) {
      console.error("Error sharing product:", error.message);
    }
  };

  const renderRelatedItem = ({ item }: { item: string }) => {
    // @ts-ignore
    const related = PRODUCTS[item]; 
    if(!related) return null;
    const startPrice = related.variants ? related.variants[0].price : 'N/A';
    
    // ✅ FALLBACK ADDED HERE
    const displayImage = related.image || (related.images && related.images[0]); 
    
    return (
      <TouchableOpacity 
        style={styles.relatedCard} 
        onPress={() => router.push(`/product/${related.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.relatedImageWrapper}>
          <Image source={displayImage} style={styles.relatedImage} resizeMode="contain" />
        </View>
        <Text style={styles.relatedTitle} numberOfLines={2}>{related.name}</Text>
        <Text style={styles.relatedPrice}>{startPrice}</Text>
        <View style={styles.addMiniBtn}>
          <Ionicons name="add" size={16} color="#1B5E20" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* --- AMBIENT SUBTLE BACKGROUND BLOBS --- */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} /> 
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* --- CAROUSEL IMAGE AREA --- */}
        <FadeInView>
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
            >
              {productImages.map((img: any, index: number) => (
                <View key={index} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={img} style={styles.mainImage} resizeMode="contain" />
                </View>
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            {productImages.length > 1 && (
              <View style={styles.pagination}>
                {productImages.map((_: any, index: number) => (
                  <View 
                    key={index} 
                    style={[
                      styles.dot, 
                      activeImageIndex === index ? styles.activeDot : styles.inactiveDot
                    ]} 
                  />
                ))}
              </View>
            )}
          </View>
        </FadeInView>

        {/* --- OVERLAPPING CONTENT SHEET --- */}
        <View style={styles.contentSheet}>
          
          {/* TITLE & DYNAMIC PRICE */}
          <FadeInView delay={100}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.name}</Text>
              
              {/* --- UPDATED SHARE BUTTON --- */}
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
                <Ionicons name="share-social-outline" size={22} color="#1B5E20" />
              </TouchableOpacity>
            </View>

            <Text style={styles.categoryText}>{product.category || 'Premium Health'}</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{selectedVariant?.price}</Text>
              {selectedVariant?.originalPrice && (
                <Text style={styles.originalPrice}>{selectedVariant?.originalPrice}</Text>
              )}
            </View>

            {/* PROMO BADGE */}
            {selectedVariant?.promoText && (
              <View style={styles.promoBadge}>
                <Ionicons name="pricetag" size={14} color="#D84315" />
                <Text style={styles.promoText}>{selectedVariant.promoText}</Text>
              </View>
            )}
          </FadeInView>

          {/* VARIANT SELECTOR */}
          <FadeInView delay={200}>
            {product.variants && (
              <View style={styles.selectorContainer}>
                <Text style={styles.sectionHeader}>Select Pack Size</Text>
                
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedVariantIndex}
                    onValueChange={(itemValue) => setSelectedVariantIndex(itemValue)}
                    style={styles.picker}
                  >
                    {product.variants.map((variant: any, index: number) => (
                      <Picker.Item 
                        key={index} 
                        label={`${variant.label} - ${variant.price}`} 
                        value={index} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </FadeInView>

          {/* DESCRIPTION CARD */}
          <FadeInView delay={300}>
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="document-text" size={20} color="#33691E" />
                <Text style={styles.cardTitle}>Product Description</Text>
              </View>
              <Text style={styles.description}>{product.description}</Text>
              
              {product.highlight && (
                <View style={styles.highlightBox}>
                  <Ionicons name="sparkles" size={16} color="#F57F17" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.highlightText}>{product.highlight}</Text>
                </View>
              )}
            </View>
          </FadeInView>

          {/* RELATED ITEMS */}
          <FadeInView delay={400}>
            <View style={styles.relatedSection}>
              <Text style={styles.sectionHeader}>You May Also Like</Text>
              <FlatList
                data={['a1', 'h1', 'h2', 'c1']} 
                horizontal
                renderItem={renderRelatedItem}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              />
            </View>
          </FadeInView>

        </View>
      </ScrollView>

      {/* --- STICKY FLOATING FOOTER --- */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn} activeOpacity={0.7}>
             <Ionicons name="remove" size={20} color={quantity === 1 ? "#999" : "#1B5E20"} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn} activeOpacity={0.7}>
             <Ionicons name="add" size={20} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToBagBtn} onPress={handleAddToBag} activeOpacity={0.9}>
          <Text style={styles.addToBagText}>ADD TO BAG</Text>
          <Ionicons name="bag-add" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },

  // Ambient Background
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.2, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: 50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', top: 300, left: -150 },

  // Image Area
  imageContainer: {
    height: 380,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  mainImage: { width: width * 0.8, height: '80%', zIndex: 2 }, 
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40, // Raised slightly to account for the overlapping sheet
    alignSelf: 'center',
    zIndex: 3,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#1B5E20', width: 20 }, // Expanded active dot
  inactiveDot: { backgroundColor: 'rgba(0,0,0,0.2)' },
  
  // Overlapping Content Sheet
  contentSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30, // Creates the overlap effect
    paddingTop: 24,
    paddingHorizontal: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    minHeight: Dimensions.get('window').height * 0.5,
  },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', flex: 1, marginRight: 10, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  shareBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FDF5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8F5E9' },
  
  categoryText: { fontSize: 14, color: '#888', fontWeight: '600', marginBottom: 16 },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  currentPrice: { fontSize: 28, fontWeight: '900', color: '#1B5E20', marginRight: 12 },
  originalPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through', marginBottom: 4, fontWeight: '500' },
  
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  promoText: { fontSize: 13, color: '#D84315', fontWeight: '700', marginLeft: 6, letterSpacing: 0.3 },

  selectorContainer: { marginBottom: 24 },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 12 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FDF5',
  },
  picker: { height: 55, width: '100%' },

  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1B5E20', marginLeft: 8 },
  description: { fontSize: 14, lineHeight: 24, color: '#555', fontWeight: '500' },
  highlightBox: { 
    flexDirection: 'row', marginTop: 16, backgroundColor: '#FFFDE7', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FFF59D' 
  },
  highlightText: { color: '#F57F17', fontWeight: '700', lineHeight: 20, flex: 1, fontSize: 13 },

  relatedSection: { marginTop: 8 },
  relatedList: { paddingVertical: 10, paddingRight: 20 },
  relatedCard: { 
    width: 150, marginRight: 16, backgroundColor: '#FFF', borderRadius: 20, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)', position: 'relative'
  },
  relatedImageWrapper: { width: '100%', height: 110, backgroundColor: '#F8F9FA', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  relatedImage: { width: '80%', height: '80%' },
  relatedTitle: { fontSize: 14, fontWeight: '700', color: '#222', marginBottom: 4, lineHeight: 18 },
  relatedPrice: { fontSize: 15, fontWeight: '800', color: '#1B5E20' },
  addMiniBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#F1F8E9', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  // --- STICKY FLOATING FOOTER ---
  stickyFooter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
    zIndex: 100,
  },
  qtyContainer: { 
    flexDirection: 'row', backgroundColor: '#F8FDF5', borderRadius: 20, alignItems: 'center', 
    height: 56, width: '35%', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E8F5E9',
    marginRight: 16,
  },
  qtyBtn: { paddingHorizontal: 16, height: '100%', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  
  addToBagBtn: { 
    flex: 1, flexDirection: 'row', backgroundColor: '#1B5E20', borderRadius: 20, 
    height: 56, justifyContent: 'center', alignItems: 'center', 
    shadowColor: '#1B5E20', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  addToBagText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});