// app/(tabs)/products.tsx
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../components/HeaderTemp';
import { useWishlist } from '../../src/context/wishlistContext';
import { PRODUCTS } from '../../src/constants/productsData'; 

const { width } = Dimensions.get('window');

const CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
  'Ready-to-Cook Mixes': 'Healthy, quick-cook mixes including millet idli, dosa, upma, and pongal options.',
  'Healthy Breakfast Range': 'Start your day with high-protein cereal flakes, organic muesli, and millet granola.',
  'Healthy Snacking Range': 'Guilt-free munching with handcrafted millet cookies, murukku, chikki, and namkeen.',
  'Bakery & Convenience Foods': 'Maida-free alternatives including multi-millet pasta, noodles, and ready-to-eat variations.',
  'Health & Wellness Range': 'Targeted nutrition options containing sugar management atta and functional diet mixes.',
  'Traditional Value-Added Products': 'Time-tested health porridges like authentic ragi malt and instant kanji.',
  'Weekly Comprehensive Kits': 'Complete all-in-one nutrition boxes structured for the entire family.'
};

const getGroupedProducts = () => {
  const groups: { [key: string]: any[] } = {};
  
  Object.values(PRODUCTS).forEach((product) => {
    const cat = product.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
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

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
};

const ProductCard = ({ item }: { item: any }) => {
  const router = useRouter();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const scale = useRef(new Animated.Value(1)).current;

  const liked = isInWishlist(item.id);
  const displayImage = item.image || (item.images && item.images[0]);
  const displayPrice = item.variants && item.variants.length > 0 ? item.variants[0].price : 'N/A';
  const displayTitle = item.name.split('|')[0].trim();

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onPress={() => router.push(`/product/${item.id}`)}
        style={styles.cardContainer}
      >
        <TouchableOpacity style={styles.likeButton} onPress={handleToggleLike} activeOpacity={0.7}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#e74c3c" : "#888"} />
        </TouchableOpacity>

        <View style={styles.imageWrapper}>
          {displayImage ? (
            <Image source={displayImage} style={styles.productImage} resizeMode="contain" />
          ) : (
            <Ionicons name="leaf" size={36} color="#DDD" />
          )}
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={2}>{displayTitle}</Text>
          <View style={styles.actionRow}>
            <Text style={styles.productPrice}>{displayPrice}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push(`/product/${item.id}`)}>
              <Text style={styles.addButtonText}>VIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  function handleToggleLike() {
    toggleWishlistItem({ id: item.id, name: item.name, price: displayPrice, image: displayImage });
  }
};

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const { getWishlistCount } = useWishlist();
  const { sections, categories } = useMemo(() => getGroupedProducts(), []);

  return (
    <View style={styles.innerLayoutContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <Header />

      <TouchableOpacity style={styles.wishlistFloat} onPress={() => router.push('/components/wishlist')}>
        <Ionicons name="heart" size={24} color="#FFF" />
        <View style={styles.wishlistBadge}><Text style={styles.wishlistBadgeText}>{getWishlistCount()}</Text></View>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        <FadeInView delay={50}>
          <View style={styles.heroSection}>
            <Text style={styles.pageTitle}>Natureswad Food Store</Text>
            <View style={styles.divider} />
            <Text style={styles.pageSubTitle}>Explore whole grains, low GI alternatives, and functional dietary mixes.</Text>
          </View>
        </FadeInView>

        {sections.map((section, index) => {
          if (selectedCategory !== 'All' && section.category !== selectedCategory) return null;

          return (
            <FadeInView key={section.id} delay={100 + (index * 50)}>
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

export default function ProductsScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProductsContent />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  innerLayoutContainer: { flex: 1, backgroundColor: '#F8F9FA', overflow: 'visible' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },
  wishlistFloat: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#e74c3c', justifyContent: 'center', alignItems: 'center', elevation: 6, zIndex: 100, borderWidth: 2, borderColor: '#FFF' },
  wishlistBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#FFF', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#e74c3c' },
  wishlistBadgeText: { color: '#e74c3c', fontSize: 9, fontWeight: '900' },
  filterContainer: { paddingVertical: 12, zIndex: 10 },
  filterScroll: { paddingHorizontal: 16 },
  filterChip: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8', elevation: 1 },
  filterChipActive: { backgroundColor: '#1B5E20', borderColor: '#1B5E20', elevation: 3 },
  filterText: { color: '#555', fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#FFF', fontWeight: '700' },
  heroSection: { alignItems: 'center', marginVertical: 16, paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, color: '#1A1A1A', textAlign: 'center', fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  divider: { width: 40, height: 3, backgroundColor: '#2E7D32', marginVertical: 8, borderRadius: 2 },
  pageSubTitle: { fontSize: 13, textAlign: 'center', color: '#666', fontStyle: 'italic' },
  sectionContainer: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  categoryTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  categoryDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  listContent: { paddingLeft: 16, paddingRight: 8 },
  cardWrapper: { marginRight: 14, paddingVertical: 4 },
  cardContainer: { width: 190, minHeight: 280, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 3, padding: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)', overflow: 'visible' },
  likeButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 2 },
  imageWrapper: { height: 130, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 14 },
  productImage: { width: '85%', height: '85%' },
  imageOverlay: { position: 'absolute', bottom: 0, width: '100%', height: '30%', backgroundColor: 'rgba(0,0,0,0.02)', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  cardContent: { marginTop: 10 },
  productName: { fontSize: 14, fontWeight: '700', color: '#222', minHeight: 38, lineHeight: 18 },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#1B5E20' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  addButton: { backgroundColor: '#F1F8E9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#C8E6C9' },
  addButtonText: { color: '#2E7D32', fontWeight: '800', fontSize: 12 }
});