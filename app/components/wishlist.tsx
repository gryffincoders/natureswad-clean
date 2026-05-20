import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../../src/context/wishlistContext';

// 1. Import HeaderTemp
import HeaderTemp from './HeaderTemp';

// --- REUSABLE ANIMATED COMPONENT ---
const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
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
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {children}
    </Animated.View>
  );
};

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlistItems, toggleWishlistItem, clearWishlist } = useWishlist();

  const renderWishlistItem = ({ item, index }: { item: any, index: number }) => (
    <FadeInView delay={50 + (index * 100)}>
      <View style={styles.wishlistCard}>
        
        {/* Click Image -> Go to Product Details */}
        <TouchableOpacity 
          style={styles.itemImageContainer}
          onPress={() => router.push(`/product/${item.id}`)}
          activeOpacity={0.9}
        >
          <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
          <View style={styles.imageOverlay} />
        </TouchableOpacity>
        
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
          
          <View style={styles.itemActions}>
            {/* View Button */}
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => router.push(`/product/${item.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color="#2E7D32" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sleek Remove Button */}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => toggleWishlistItem(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#E53935" />
        </TouchableOpacity>
        
      </View>
    </FadeInView>
  );

  const renderEmptyState = () => (
    <FadeInView delay={100}>
      <View style={styles.emptyState}>
        <View style={styles.emptyIconWrapper}>
          <Ionicons name="heart-outline" size={80} color="#FFCDD2" />
        </View>
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptySubtitle}>
          Save products you love by tapping the heart icon. Let's find some favorites!
        </Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.9}
        >
          <Text style={styles.shopButtonText}>Browse Products</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </FadeInView>
  );

  return (
    <View style={styles.container}>
      {/* --- AMBIENT SUBTLE BACKGROUND BLOBS --- */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      {/* 2. Integrated HeaderTemp */}
      <HeaderTemp />

      {/* 3. Sub-Header for Title & Clear All */}
      <View style={styles.subHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </Text>
        </View>
        
        {wishlistItems.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearWishlist} activeOpacity={0.7}>
            <Ionicons name="trash-bin-outline" size={16} color="#E53935" />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          wishlistItems.length === 0 && styles.listContainerEmpty 
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  // Ambient Background
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFEBEE', bottom: 100, left: -150 }, // Slight red tint for wishlist vibe

  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    zIndex: 1,
  },
  headerContent: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif',
    letterSpacing: 0.5,
  },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4, fontWeight: '600' },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEBEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  clearText: { color: '#E53935', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  
  listContainer: { paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1, paddingBottom: 40 },
  listContainerEmpty: { flexGrow: 1, justifyContent: 'center' },
  
  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, marginTop: -60 },
  emptyIconWrapper: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#FFEBEE',
  },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 10, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  shopButton: {
    backgroundColor: '#1B5E20', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30, 
    shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  shopButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  
  // Modern Wishlist Card
  wishlistCard: {
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 16,
    marginBottom: 16, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04, 
    shadowRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.02)',
  },
  itemImageContainer: {
    width: 100, height: 100, borderRadius: 16, backgroundColor: '#F8F9FA',
    justifyContent: 'center', alignItems: 'center', marginRight: 16, overflow: 'hidden'
  },
  itemImage: { width: '85%', height: '85%', zIndex: 2 },
  imageOverlay: { position: 'absolute', bottom: 0, width: '100%', height: '30%', backgroundColor: 'rgba(0,0,0,0.03)' },
  
  itemDetails: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 6, paddingRight: 30, lineHeight: 22 },
  itemPrice: { fontSize: 18, fontWeight: '800', color: '#1B5E20', marginBottom: 12 },
  
  itemActions: { flexDirection: 'row' },
  viewButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12,
    backgroundColor: '#F1F8E9', borderWidth: 1, borderColor: '#C8E6C9',
    alignSelf: 'flex-start'
  },
  viewButtonText: { color: '#2E7D32', fontSize: 13, fontWeight: '800' },
  
  // Floating Remove Button
  removeButton: {
    position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
});