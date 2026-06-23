// app/product/[id].tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Animated, FlatList, Platform, Share 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderTemp from '../components/HeaderTemp'; 
import { PRODUCTS } from '../../src/constants/productsData'; 
import { useCart } from '../../src/context/CartContext'; 

const { width } = Dimensions.get('window');

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, [delay]);

  return <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>{children}</Animated.View>;
};

// ✅ CUSTOM SEGMENT PICKER COMPONENT - WORKS FLUIDLY ON BOTH iOS AND ANDROID
const CustomVariantPicker = ({ variants, selectedIndex, onValueChange }: any) => {
  const [showPicker, setShowPicker] = useState(false);
  
  if (!variants || variants.length === 0) return null;
  
  const selectedVariant = variants[selectedIndex];
  
  return (
    <View style={styles.customPickerContainer}>
      <TouchableOpacity 
        style={styles.customPickerButton}
        onPress={() => setShowPicker(!showPicker)}
        activeOpacity={0.7}
      >
        <Text style={styles.customPickerText}>
          {selectedVariant?.label} - {selectedVariant?.price}
        </Text>
        <Ionicons name={showPicker ? "chevron-up" : "chevron-down"} size={20} color="#1B5E20" />
      </TouchableOpacity>
      
      {showPicker && (
        <>
          {/* Backdrop hook layers to click away easily */}
          <TouchableOpacity 
            style={styles.dropdownBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowPicker(false)} 
          />
          
          <View style={styles.customPickerDropdown}>
            {variants.map((variant: any, idx: number) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.customPickerItem,
                  selectedIndex === idx && styles.customPickerItemSelected
                ]}
                onPress={() => {
                  onValueChange(idx);
                  setShowPicker(false);
                }}
              >
                <View style={styles.customPickerItemContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.customPickerItemLabel,
                      selectedIndex === idx && styles.customPickerItemTextSelected
                    ]}>
                      {variant.label}
                    </Text>
                    <Text style={[
                      styles.customPickerItemPrice,
                      selectedIndex === idx && styles.customPickerItemPriceSelected
                    ]}>
                      {variant.price}
                    </Text>
                  </View>
                  {selectedIndex === idx && (
                    <Ionicons name="checkmark-circle" size={22} color="#1B5E20" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const { addToCart } = useCart(); 
  const insets = useSafeAreaInsets();
  
  const product = useMemo(() => {
    // @ts-ignore
    return PRODUCTS[id] || Object.values(PRODUCTS)[0];
  }, [id]);

  // Dynamic safely checking filter block for product image variants array structure
  const productImages = useMemo(() => {
    const images = [];
    if (product?.images?.length) {
      images.push(...product.images.filter(Boolean));
    }
    if (product?.image) {
      images.push(product.image);
    }
    return images;
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants ? product.variants[selectedVariantIndex] : null;

  useEffect(() => {
    setQuantity(1);
    setSelectedVariantIndex(0);
    setActiveImageIndex(0);
  }, [id]);

  // DYNAMIC NON-REPEATING CROSS-CATEGORY DISCOVERY POOL GENERATION
  const relatedProductItems = useMemo(() => {
    const allItems = Object.values(PRODUCTS);
    const crossCategoryPool: any[] = [];
    const categoriesFilled = new Set();

    allItems.forEach(item => {
      if (item.id === product.id) return;
      if (!categoriesFilled.has(item.category)) {
        crossCategoryPool.push(item);
        categoriesFilled.add(item.category);
      }
    });

    if (crossCategoryPool.length < 4) {
      allItems.forEach(item => {
        if (item.id !== product.id && !crossCategoryPool.some(m => m.id === item.id)) {
          crossCategoryPool.push(item);
        }
      });
    }
    return crossCategoryPool.slice(0, 4);
  }, [product.id]);

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price, 
      image: productImages.length > 0 ? productImages[0] : null,
      quantity: quantity,
      weight: selectedVariant.label 
    });
    router.push('/components/ShoppingBag');
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this amazing natural product! 🌿\n\n✨ ${product.name}\n💰 ${selectedVariant?.price || ''}\n\nGet it now on the Natureswad App!`;
      await Share.share({ message: shareMessage });
    } catch (error: any) {
      console.error("Error sharing product:", error.message);
    }
  };

  const renderRelatedItem = ({ item }: { item: any }) => {
    if (!item) return null;
    const startPrice = item.variants ? item.variants[0].price : 'N/A';
    const displayImage = item.image || (item.images && item.images[0]); 

    return (
      <TouchableOpacity 
        style={styles.relatedCard} 
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.relatedImageWrapper}>
          {displayImage ? (
            <Image source={displayImage} style={styles.relatedImage} resizeMode="contain" />
          ) : (
            <Ionicons name="leaf" size={28} color="#CCCCCC" />
          )}
        </View>
        <Text style={styles.relatedTitle} numberOfLines={2}>{item.name.split('|')[0].trim()}</Text>
        <Text style={styles.relatedPrice}>{startPrice}</Text>
        <View style={styles.addMiniBtn}><Ionicons name="add" size={16} color="#1B5E20" /></View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} /> 
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* GALLERY CAROUSEL */}
        <FadeInView>
          <View style={styles.imageContainer}>
            {productImages.length > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width))}
                scrollEventThrottle={16}
              >
                {productImages.map((img: any, index: number) => (
                  <View key={index} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={img} style={styles.mainImage} resizeMode="contain" />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Ionicons name="leaf" size={80} color="#E8E8E8" />
            )}

            {productImages.length > 1 && (
              <View style={styles.pagination}>
                {productImages.map((_: any, index: number) => (
                  <View key={index} style={[styles.dot, activeImageIndex === index ? styles.activeDot : styles.inactiveDot]} />
                ))}
              </View>
            )}
          </View>
        </FadeInView>

        {/* DETAILS OVERLAY SHEET PANEL */}
        <View style={styles.contentSheet}>
          <FadeInView delay={100}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.name.split('|')[0].trim()}</Text>
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
          </FadeInView>

          {/* SIZES VARIANT SYSTEM SELECTION ROW */}
          <FadeInView delay={180}>
            {product.variants && product.variants.length > 0 && (
              <View style={styles.selectorContainer}>
                <Text style={styles.sectionHeader}>Select Pack Size</Text>
                <CustomVariantPicker
                  variants={product.variants}
                  selectedIndex={selectedVariantIndex}
                  onValueChange={setSelectedVariantIndex}
                />
              </View>
            )}
          </FadeInView>

          {/* DESCRIPTION SECTION CARD */}
          <FadeInView delay={250}>
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="document-text" size={20} color="#33691E" />
                <Text style={styles.cardTitle}>Product Description</Text>
              </View>
              <Text style={styles.description}>{product.description}</Text>
              
              {product.nutritionalInfo?.healthBenefits && (
                <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 14 }}>
                  <Text style={[styles.cardTitle, { marginLeft: 0, marginBottom: 8 }]}>Why Choose This?</Text>
                  {product.nutritionalInfo.healthBenefits.map((benefit: string, i: number) => (
                    <Text key={i} style={[styles.description, { marginBottom: 4 }]}>• {benefit}</Text>
                  ))}
                </View>
              )}
            </View>
          </FadeInView>

          {/* RELATED MATRIX SHELF */}
          <FadeInView delay={300}>
            <View style={styles.relatedSection}>
              <Text style={styles.sectionHeader}>You May Also Like</Text>
              <FlatList
                data={relatedProductItems} 
                horizontal
                renderItem={renderRelatedItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              />
            </View>
          </FadeInView>
        </View>
      </ScrollView>

      {/* FLOATING ACTION BOTTOM PIN FOOTER CONTROL BAR */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
             <Ionicons name="remove" size={20} color={quantity === 1 ? "#999" : "#1B5E20"} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
             <Ionicons name="add" size={20} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToBagBtn} onPress={handleAddToBag}>
          <Text style={styles.addToBagText}>ADD TO BAG</Text>
          <Ionicons name="bag-add" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.15 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: 50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', top: 300, left: -150 },
  imageContainer: { height: 340, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  mainImage: { width: width * 0.75, height: '75%' }, 
  pagination: { flexDirection: 'row', position: 'absolute', bottom: 30, alignSelf: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#1B5E20', width: 16 },
  inactiveDot: { backgroundColor: 'rgba(0,0,0,0.15)' },
  contentSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -20, paddingTop: 24, paddingHorizontal: 20, elevation: 5, minHeight: Dimensions.get('window').height * 0.5 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', flex: 1, marginRight: 10, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  shareBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F8FDF5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8F5E9' },
  categoryText: { fontSize: 13, color: '#888', fontWeight: '600', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  currentPrice: { fontSize: 26, fontWeight: '900', color: '#1B5E20', marginRight: 12 },
  originalPrice: { fontSize: 15, color: '#999', textDecorationLine: 'line-through', marginBottom: 2 },
  selectorContainer: { marginBottom: 20, position: 'relative', zIndex: 1000 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
  
  // Custom Dynamic Selection Modal Override Bounds
  customPickerContainer: { position: 'relative', width: '100%' },
  customPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 14,
    backgroundColor: '#F8FDF5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  customPickerText: { fontSize: 15, color: '#1A1A1A', fontWeight: '600' },
  dropdownBackdrop: { position: 'absolute', top: -2000, left: -1000, right: -1000, bottom: -1000, zIndex: 998 },
  customPickerDropdown: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    zIndex: 999,
    maxHeight: 220,
    overflow: 'scroll'
  },
  customPickerItem: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  customPickerItemSelected: { backgroundColor: '#F1F8E9' },
  customPickerItemContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customPickerItemLabel: { fontSize: 14, color: '#333', fontWeight: '600', marginBottom: 2 },
  customPickerItemPrice: { fontSize: 13, color: '#666', fontWeight: '500' },
  customPickerItemTextSelected: { color: '#1B5E20', fontWeight: '800' },
  customPickerItemPriceSelected: { color: '#1B5E20' },
  
  infoCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 20, elevation: 1, borderWidth: 1, borderColor: 'rgba(0,0,0,0.01)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1B5E20', marginLeft: 8 },
  description: { fontSize: 14, lineHeight: 22, color: '#555' },
  relatedSection: { marginTop: 4, zIndex: 1 },
  relatedList: { paddingVertical: 8 },
  relatedCard: { width: 140, marginRight: 14, backgroundColor: '#FFF', borderRadius: 16, padding: 12, elevation: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.01)' },
  relatedImageWrapper: { width: '100%', height: 100, backgroundColor: '#F8F9FA', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  relatedImage: { width: '80%', height: '80%' },
  relatedTitle: { fontSize: 13, fontWeight: '700', color: '#222', marginBottom: 4 },
  relatedPrice: { fontSize: 14, fontWeight: '800', color: '#1B5E20' },
  addMiniBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#F1F8E9', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', paddingHorizontal: 20, paddingTop: 14, borderTopLeftRadius: 28, borderTopRightRadius: 28, elevation: 15, zIndex: 10 },
  qtyContainer: { flexDirection: 'row', backgroundColor: '#F8FDF5', borderRadius: 16, alignItems: 'center', height: 52, width: '35%', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E8F5E9', marginRight: 14 },
  qtyBtn: { paddingHorizontal: 12, height: '100%', justifyContent: 'center' },
  qtyText: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  addToBagBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#1B5E20', borderRadius: 16, height: 52, justifyContent: 'center', alignItems: 'center' },
  addToBagText: { color: '#fff', fontWeight: '800', fontSize: 14 }
});