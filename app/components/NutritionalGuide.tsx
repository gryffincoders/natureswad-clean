// app/components/NutritionalGuide.tsx
import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, Animated, Dimensions, 
  Platform, TouchableOpacity, TextInput, UIManager, LayoutAnimation 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderTemp from './HeaderTemp';
import { PRODUCTS } from '../../src/constants/productsData';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

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

// Helper to clean up citation tags
const cleanText = (text: string) => text ? text.replace(/\[cite:\s*\d+\]/g, '') : '';

export default function NutritionalGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract products that actually have nutritional data
  const validProducts = Object.values(PRODUCTS).filter(
    p => p.nutritionalInfo && p.nutritionalInfo.healthBenefits && p.nutritionalInfo.keyNutrients
  );

  // Extract unique categories for the filter chips
  const categories = ['All', ...Array.from(new Set(validProducts.map(p => p.category || 'Other')))];

  // Filter logic based on Search and Category
  const filteredProducts = validProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* HERO SECTION */}
        <FadeInView>
          <View style={styles.heroSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="leaf" size={32} color="#1B5E20" />
            </View>
            <Text style={styles.pageTitle}>Nutritional Science</Text>
            <Text style={styles.pageSubtitle}>
              Tap on any ingredient below to discover its traditional wisdom and health benefits.
            </Text>
          </View>
        </FadeInView>

        {/* SEARCH & FILTERS */}
        <FadeInView delay={100}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search ingredients (e.g., Millet, Jaggery)..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#CCC" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {categories.map((cat, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setExpandedId(null); // Close open cards when changing categories
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeInView>

        {/* ACCORDION LIST */}
        <View style={styles.listContainer}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No ingredients found.</Text>
            </View>
          ) : (
            filteredProducts.map((product, index) => {
              const displayImage = (product as any).image || ((product as any).images && (product as any).images[0]);
              const isExpanded = expandedId === product.id;

              return (
                <FadeInView key={product.id} delay={150 + (index * 50)}>
                  <TouchableOpacity 
                    style={[styles.accordionCard, isExpanded && styles.accordionCardActive]} 
                    activeOpacity={0.9} 
                    onPress={() => toggleExpand(product.id)}
                  >
                    {/* Compact Header View */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.thumbWrapper}>
                        {displayImage ? (
                          <Image source={displayImage} style={styles.thumbImage} resizeMode="contain" />
                        ) : (
                          <Ionicons name="leaf" size={20} color="#A5D6A7" />
                        )}
                      </View>
                      
                      <View style={styles.cardTitleInfo}>
                        <Text style={styles.productName} numberOfLines={isExpanded ? undefined : 2}>
                          {cleanText(product.name)}
                        </Text>
                        <Text style={styles.categoryText}>{product.category}</Text>
                      </View>

                      <View style={[styles.chevronWrapper, isExpanded && styles.chevronExpanded]}>
                        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={isExpanded ? "#FFF" : "#1B5E20"} />
                      </View>
                    </View>

                    {/* Expanded Detailed View */}
                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <View style={styles.divider} />

                        {/* Why it's great */}
                        <Text style={styles.sectionHeading}>
                          <Ionicons name="sparkles" size={16} color="#F25D23" /> Health Benefits
                        </Text>
                        <View style={styles.benefitsList}>
                          {product.nutritionalInfo?.healthBenefits?.map((benefit: string, idx: number) => (
                            <View key={idx} style={styles.bulletRow}>
                              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={styles.bulletIcon} />
                              <Text style={styles.bulletText}>{cleanText(benefit)}</Text>
                            </View>
                          ))}
                        </View>

                        {/* What's inside */}
                        <View style={styles.nutrientsBox}>
                          <Text style={styles.sectionHeadingDark}>Key Nutrients</Text>
                          <View style={styles.tagsContainer}>
                            {product.nutritionalInfo?.keyNutrients?.map((nutrient: string, idx: number) => (
                              <View key={idx} style={styles.nutrientTag}>
                                <Text style={styles.nutrientTagText}>{cleanText(nutrient)}</Text>
                              </View>
                            ))}
                          </View>
                        </View>

                      </View>
                    )}
                  </TouchableOpacity>
                </FadeInView>
              );
            })
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },

  scrollContent: { paddingBottom: 60, zIndex: 1 },

  // Hero
  heroSection: { alignItems: 'center', marginTop: 20, marginBottom: 16, paddingHorizontal: 20 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#1B5E20', shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif', letterSpacing: 0.5, marginBottom: 8 },
  pageSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, fontWeight: '500' },

  // Search & Filters
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 16, paddingHorizontal: 16, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#E8E8E8', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  
  filterScroll: { paddingHorizontal: 16, marginBottom: 20 },
  filterChip: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 3, elevation: 1 },
  filterChipActive: { backgroundColor: '#1B5E20', borderColor: '#1B5E20' },
  filterText: { color: '#555', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFF', fontWeight: '800' },

  // List
  listContainer: { paddingHorizontal: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { color: '#888', fontSize: 15, fontWeight: '500', marginTop: 10 },

  // Accordion Card
  accordionCard: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  accordionCardActive: { borderColor: '#C8E6C9', backgroundColor: '#FAFDFA' },
  
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  thumbWrapper: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#F0F0F0' },
  thumbImage: { width: '80%', height: '80%' },
  cardTitleInfo: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4, lineHeight: 20 },
  categoryText: { fontSize: 12, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  chevronWrapper: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  chevronExpanded: { backgroundColor: '#1B5E20' },

  // Expanded Details
  expandedContent: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#E8E8E8', marginBottom: 16 },
  
  sectionHeading: { fontSize: 15, fontWeight: '800', color: '#F25D23', marginBottom: 12 },
  sectionHeadingDark: { fontSize: 14, fontWeight: '800', color: '#1B5E20', marginBottom: 10 },
  
  benefitsList: { marginBottom: 20 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletIcon: { marginRight: 8, marginTop: 2 },
  bulletText: { flex: 1, fontSize: 13, color: '#444', lineHeight: 20, fontWeight: '500' },

  nutrientsBox: { backgroundColor: '#F1F8E9', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#C8E6C9' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nutrientTag: { backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E8F5E9' },
  nutrientTagText: { fontSize: 12, color: '#2E7D32', fontWeight: '700' },
});