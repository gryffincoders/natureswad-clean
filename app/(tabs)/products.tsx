import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/HeaderTemp';
import { useWishlist } from '../../src/context/wishlistContext';
import { PRODUCTS } from '../../src/constants/productsData'; 

const { width } = Dimensions.get('window');

// ---------- DYNAMIC DATA PROCESSING (SEO UPDATED) ----------

// SEO Keyword infused category descriptions
const CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
  'Atta & Grains': 'Buy organic atta online, low GI flours, and the best millets for diabetes.',
  'Pulses & Dals': 'Buy organic dal online India. Protein-rich, chemical-free pulses for daily nutrition.',
  'Health Care': 'Natural health food products, no preservative pickles, and cold pressed oils India.',
  'Combo': 'Healthy breakfast mix India. The perfect gluten-free gifts for your family.',
};

// Process the raw PRODUCTS object into grouped sections
const getGroupedProducts = () => {
  const groups: { [key: string]: any[] } = {};
  
  Object.values(PRODUCTS).forEach((product) => {
    const cat = product.category || 'Other';
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(product);
  });

  const sections = Object.keys(groups).map((cat, index) => ({
    id: String(index),
    category: cat,
    description: CATEGORY_DESCRIPTIONS[cat] || 'Buy organic food products and natural groceries online India.',
    items: groups[cat],
  }));

  const categories = ['All', ...Object.keys(groups)];

  return { sections, categories };
};

// ---------- ANIMATED SECTION ----------
const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// ---------- MODERN PRODUCT CARD ----------
const ProductCard = ({ item }: { item: any }) => {
  const router = useRouter();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const scale = useRef(new Animated.Value(1)).current;

  const liked = isInWishlist(item.id);
  
  const displayImage = item.image || (item.images && item.images[0]);
  const displayPrice = item.variants && item.variants.length > 0 ? item.variants[0].price : '';

  // SEO TITLE SPLITTER - UI ONLY SHOWS THE CLEAN NAME
  const rawText = item.name ? item.name.replace(/[\[\]]/g, '') : '';
  const displayTitle = rawText.split('|')[0].trim();

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const handleToggleLike = () => {
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      price: displayPrice, 
      image: displayImage
    });
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(`/product/${item.id}`)}
        style={styles.cardContainer}
      >
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={handleToggleLike} 
          activeOpacity={0.7}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={20} 
            color={liked ? "#e74c3c" : "#888"} 
          />
        </TouchableOpacity>

        <View style={styles.imageWrapper}>
          <Image source={displayImage} style={styles.productImage} resizeMode="contain" />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.cardContent}>
          {/* Displaying the split, clean title */}
          <Text style={styles.productName} numberOfLines={2}>
            {displayTitle}
          </Text>
          
          <View style={styles.actionRow}>
            <Text style={styles.productPrice}>{displayPrice}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push(`/product/${item.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ---------- MAIN SCREEN ----------
export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const { getWishlistCount } = useWishlist();

  const { sections, categories } = useMemo(() => getGroupedProducts(), []);

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <Header />

      <TouchableOpacity 
        style={styles.wishlistFloat}
        onPress={() => router.push('/components/wishlist')}
        activeOpacity={0.9}
      >
        <Ionicons name="heart" size={24} color="#FFF" />
        <View style={styles.wishlistBadge}>
          <Text style={styles.wishlistBadgeText}>{getWishlistCount()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
              style={[
                styles.filterChip,
                selectedCategory === cat && styles.filterChipActive
              ]}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === cat && styles.filterTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <FadeInView delay={50}>
          <View style={styles.heroSection}>
            {/* SEO UPDATE: Replaced "Our Offerings" */}
            <Text style={styles.pageTitle}>Buy Organic Food India</Text>
            <View style={styles.divider} />
            <Text style={styles.pageSubTitle}>
              Buy millets online, natural groceries, and chemical-free foods.
            </Text>
          </View>
        </FadeInView>

        {sections.map((section, index) => {
          if (selectedCategory !== 'All' && section.category !== selectedCategory) return null;

          return (
            <FadeInView key={section.id} delay={150 + (index * 100)}>
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryTitle}>{section.category}</Text>
                    <Text style={styles.categoryDesc}>{section.description}</Text>
                  </View>
                </View>

                <FlatList
                  data={section.items}
                  renderItem={({ item }) => <ProductCard item={item} />}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  snapToInterval={200 + 16}
                  decelerationRate="fast"
                />
              </View>
            </FadeInView>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
  },
  bgBlob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
  blob1: {
    width: 300, height: 300,
    backgroundColor: '#E8F5E9',
    top: -50, right: -100,
  },
  blob2: {
    width: 400, height: 400,
    backgroundColor: '#FFF3E0',
    bottom: 100, left: -150,
  },
  wishlistFloat: {
    position: 'absolute',
    bottom: 30, 
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  wishlistBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFF',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  wishlistBadgeText: {
    color: '#e74c3c',
    fontSize: 10,
    fontWeight: '900',
  },
  filterContainer: {
    paddingVertical: 12,
    zIndex: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#1B5E20',
    borderColor: '#1B5E20',
    elevation: 4,
    shadowOpacity: 0.15,
    shadowColor: '#1B5E20',
  },
  filterText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 32,
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif',
    fontWeight: '900',
    letterSpacing: 1,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#2E7D32',
    marginVertical: 10,
    borderRadius: 2,
  },
  pageSubTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginBottom: 35,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  categoryDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  cardWrapper: {
    marginRight: 16,
  },
  cardContainer: {
    width: 200,
    height: 280, 
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '85%',
    height: '85%',
    zIndex: 2,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  cardContent: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B5E20',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  addButtonText: {
    color: '#2E7D32',
    fontWeight: '800',
    fontSize: 13,
  },
});