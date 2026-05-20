// app/(tabs)/bot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Image, Animated, Dimensions, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRODUCTS } from '../../src/constants/productsData';

// ✅ Properly imported global header
import HeaderTemp from '../components/HeaderTemp'; 

const { width } = Dimensions.get('window');

// --- BOT KNOWLEDGE BASE ---
const BOT_KNOWLEDGE: Record<string, { text: string; mealIdeas: string; products: string[] }> = {
  'Diabetes Management': {
    text: "For managing diabetes, the best foods are low GI, high fiber, and high protein. High fiber slows glucose absorption, keeping your blood sugar stable!",
    mealIdeas: "• Ragi dosa\n• Foxtail millet upma\n• Multi millet roti\n• Moong dal soup",
    products: ['m4', 'm3', 'm5', 'm6', 'm2', 'a2', 'f2', 'p2', 'p7', 's3', 'h1'] 
  },
  'Nursing Mothers': {
    text: "Congratulations! Nursing mothers need high calcium, iron, protein, and energy to support bone health. Here are nature's best supplements.",
    mealIdeas: "• Ragi porridge\n• Sesame laddu\n• Moong dal khichdi\n• Emmer wheat roti",
    products: ['m5', 'p1', 'p6', 'p7', 'a2', 'g2', 's2', 'h2'] 
  },
  'Kids Growth': {
    text: "Growing kids require high protein, calcium, and essential minerals to support bone development, muscle growth, and immunity.",
    mealIdeas: "• Ragi malt\n• Multi millet dosa\n• Peanut chutney\n• Moong dal khichdi",
    products: ['m5', 'm8', 'p1', 'p7', 'p6', 'p5', 'h5', 'b1', 'h2'] 
  },
  'Weight Loss': {
    text: "For healthy weight loss, you need low-calorie, high-fiber, and high-satiety foods. High fiber keeps your stomach full longer, reducing cravings!",
    mealIdeas: "• Millet salad bowl\n• Horse gram soup\n• Flaxseed chutney with jowar roti",
    products: ['m3', 'm4', 'm6', 'm2', 'p3', 'p2', 's1', 's3']
  },
  'Weight Gain': {
    text: "To gain weight healthily, focus on calorie-dense foods rich in healthy fats and proteins. No junk needed!",
    mealIdeas: "• Peanut laddu\n• Sesame chikki\n• Urad dal dosa\n• Bajra roti with ghee",
    products: ['p1', 'p6', 'm8', 's2', 'ch_group', 'po5', 'h2']
  },
  'Thyroid Support': {
    text: "For thyroid support, your body needs selenium, zinc, and anti-inflammatory foods to help maintain hormonal balance and metabolism. ",
    mealIdeas: "• Millet khichdi\n• Chickpea salad\n• Flaxseed chutney",
    products: ['m4', 'm7', 'p1', 'p5', 's1', 's4', 'h1']
  },
  'Blood Pressure Control': {
    text: "To control blood pressure, load up on high potassium, high fiber, and low sodium foods. These maintain heart health and fluid balance. ",
    mealIdeas: "• Jowar roti\n• Moong dal soup\n• Millet vegetable bowl",
    products: ['m7', 'g1', 'm5', 'p2', 'p7', 's1', 'h1']
  },
  'Heart Health': {
    text: "Protect your heart with ingredients rich in omega-3 fatty acids, complex carbohydrates, and dietary fiber to control cholesterol. ",
    mealIdeas: "• Light millet upma\n• Green gram sprouts\n• Meals cooked in cold-pressed oils",
    products: ['s1', 'm4', 'm6', 'm7', 'p2', 'p5', 'po5']
  }
};

type Message = { id: string; sender: 'bot' | 'user'; text?: string; mealIdeas?: string; products?: string[]; isGreeting?: boolean };

export default function NatureswadBot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      isGreeting: true,
      text: "Hey, I'm Sage. 🌱\n\nNo junk, no excuses. Tell me your health goals and I'll prescribe the exact roots and shoots you need to get back on track." 
    }
  ]);

  const handleTopicSelect = (topic: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: `I need recommendations for ${topic}` };
    
    const knowledge = BOT_KNOWLEDGE[topic];
    const botMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      sender: 'bot', 
      text: knowledge.text,
      mealIdeas: knowledge.mealIdeas,
      products: knowledge.products
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const renderProductCard = (productId: string) => {
    const product = PRODUCTS[productId as keyof typeof PRODUCTS];
    if (!product) return null;

    const displayImage = (product as any).image || ((product as any).images && (product as any).images[0]);
    const cleanName = product.name.replace(/\//g, '');

    return (
      <View key={product.id} style={styles.miniProductCard}>
        <View style={styles.miniImageWrapper}>
          <Image source={displayImage} style={styles.miniImage} resizeMode="contain" />
        </View>
        <Text style={styles.miniProductName} numberOfLines={2}>{cleanName}</Text>
        <Text style={styles.miniProductPrice}>{product.variants?.[0]?.price}</Text>
        
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={() => router.push(`/product/${product.id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background Ambience */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      {/* ✅ Global Header with Back Button Enabled */}
      <HeaderTemp showBack={true} />

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Bot Profile Header inside the ScrollView */}
        <View style={styles.botProfileContainer}>
          <View style={styles.botProfileIcon}>
            <Ionicons name="leaf" size={36} color="#1B5E20" />
          </View>
          <Text style={styles.botProfileTitle}>SAGE</Text>
          <Text style={styles.botProfileSubtitle}>Strictly natural. Strictly results.</Text>
        </View>

        {messages.map((msg) => (
          <Animated.View key={msg.id} style={[styles.messageWrapper, msg.sender === 'user' ? styles.userWrapper : styles.botWrapper]}>
            
            {msg.sender === 'bot' && (
              <View style={styles.botAvatar}>
                <Image source={require('../../assets/icon.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              </View>
            )}

            <View style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.botText]}>
                {msg.text}
              </Text>
              
              {msg.mealIdeas && (
                <View style={styles.mealIdeasBox}>
                  <Text style={styles.mealIdeasTitle}>Meal Ideas:</Text>
                  <Text style={styles.mealIdeasText}>{msg.mealIdeas}</Text>
                </View>
              )}
            </View>

            {msg.products && msg.products.length > 0 && (
              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationTitle}>Highly Recommended For You:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                  {msg.products.map(renderProductCard)}
                </ScrollView>
              </View>
            )}
          </Animated.View>
        ))}
      </ScrollView>

      {/* Quick Replies Area */}
      <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.quickReplyLabel}>Tap a goal to get advice:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {Object.keys(BOT_KNOWLEDGE).map((topic) => (
            <TouchableOpacity 
              key={topic} 
              style={styles.chip}
              onPress={() => handleTopicSelect(topic)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },

  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 40 },

  // ✅ New Bot Profile Styles (Appears at the top of the chat)
  botProfileContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 32,
  },
  botProfileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  botProfileTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  botProfileSubtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  messageWrapper: { marginBottom: 24, maxWidth: '90%' },
  userWrapper: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  botWrapper: { alignSelf: 'flex-start', alignItems: 'flex-start' },

  botAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  
  bubble: { padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  userBubble: { backgroundColor: '#1B5E20', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#FFF', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#E8F5E9' },
  
  messageText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  userText: { color: '#FFF' },
  botText: { color: '#333' },

  mealIdeasBox: { marginTop: 12, backgroundColor: '#F8FDF5', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#C8E6C9' },
  mealIdeasTitle: { fontSize: 14, fontWeight: '800', color: '#1B5E20', marginBottom: 6 },
  mealIdeasText: { fontSize: 13, color: '#444', lineHeight: 20, fontWeight: '500' },

  recommendationContainer: { marginTop: 12, width: width },
  recommendationTitle: { fontSize: 13, fontWeight: '800', color: '#1B5E20', marginBottom: 8, marginLeft: 40 },

  miniProductCard: { width: 140, backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginRight: 12, borderWidth: 1, borderColor: '#E8E8E8', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginLeft: 2 },
  miniImageWrapper: { width: '100%', height: 90, backgroundColor: '#F8F9FA', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  miniImage: { width: '80%', height: '80%' },
  miniProductName: { fontSize: 13, fontWeight: '700', color: '#222', marginBottom: 4, lineHeight: 16 },
  miniProductPrice: { fontSize: 13, fontWeight: '800', color: '#555', marginBottom: 10 },
  
  ctaButton: { flexDirection: 'row', backgroundColor: '#F25D23', paddingVertical: 8, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  ctaButtonText: { color: '#FFF', fontSize: 11, fontWeight: '800', marginRight: 4 },

  inputArea: { backgroundColor: '#FFF', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
  quickReplyLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginLeft: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipContainer: { paddingHorizontal: 16, paddingBottom: 10 },
  chip: { backgroundColor: '#F1F8E9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#C8E6C9' },
  chipText: { color: '#1B5E20', fontSize: 14, fontWeight: '700' },
});