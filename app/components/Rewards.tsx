import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Animated, Platform, TextInput, KeyboardAvoidingView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import HeaderTemp from '../components/HeaderTemp';

const API_URL = 'https://natureswad-backend.onrender.com/api';
const POINTS_REQUIRED = 200;
const DISCOUNT_VALUE = 200;

// --- Animation Helper ---
const FadeInView = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
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

export default function Rewards() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [guestPhoneInput, setGuestPhoneInput] = useState('');
  const [identifier, setIdentifier] = useState<string | null>(auth().currentUser?.uid || null);

  useEffect(() => {
    if (identifier) {
      fetchRewardsData(identifier);
    }
  }, [identifier]);

  const fetchRewardsData = async (uid: string) => {
    setLoading(true);
    try {
      const pointsRes = await fetch(`${API_URL}/user-points/${uid}`);
      if (pointsRes.ok) {
        const pointsData = await pointsRes.json();
        setPoints(pointsData.points || 0);
      }

      const ordersRes = await fetch(`${API_URL}/orders/${uid}`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const pointsHistory = ordersData.filter((order: any) => 
          (order.pointsEarned && order.pointsEarned > 0) || 
          (order.pointsRedeemed && order.pointsRedeemed > 0)
        );
        setHistory(pointsHistory);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSearch = () => {
    const cleanPhone = guestPhoneInput.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      setIdentifier(cleanPhone);
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  // ==========================================
  // 1. GUEST SEARCH SCREEN
  // ==========================================
  if (!identifier) {
    return (
      <View style={styles.mainContainer}>
        <HeaderTemp showBack={true} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.guestContainer}
            keyboardShouldPersistTaps="handled"
          >
            <FadeInView style={styles.guestInner}>

              {/* Icon */}
              <View style={styles.guestIconCircle}>
                <Ionicons name="star" size={44} color="#F57F17" />
              </View>

              {/* Title */}
              <Text style={styles.guestTitle}>Check Your Rewards</Text>
              <Text style={styles.guestSubtitle}>
                Enter the mobile number used during your previous checkouts to view your points and history.
              </Text>

              {/* How it works strip */}
              <View style={styles.guestHowItWorksRow}>
                <View style={styles.guestHowItem}>
                  <View style={[styles.guestHowIcon, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="cart-outline" size={18} color="#1B5E20" />
                  </View>
                  <Text style={styles.guestHowLabel}>Shop</Text>
                </View>
                <View style={styles.guestHowDivider} />
                <View style={styles.guestHowItem}>
                  <View style={[styles.guestHowIcon, { backgroundColor: '#FFF8E1' }]}>
                    <Ionicons name="sparkles-outline" size={18} color="#F57F17" />
                  </View>
                  <Text style={styles.guestHowLabel}>Earn 25 pts</Text>
                </View>
                <View style={styles.guestHowDivider} />
                <View style={styles.guestHowItem}>
                  <View style={[styles.guestHowIcon, { backgroundColor: '#FBE9E7' }]}>
                    <Ionicons name="gift-outline" size={18} color="#D84315" />
                  </View>
                  <Text style={styles.guestHowLabel}>Save ₹200</Text>
                </View>
              </View>

              {/* Input */}
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter 10-digit number" 
                  value={guestPhoneInput} 
                  onChangeText={setGuestPhoneInput} 
                  keyboardType="number-pad" 
                  maxLength={10} 
                  placeholderTextColor="#B0B5B1"
                />
              </View>

              <TouchableOpacity style={styles.guestButton} onPress={handleGuestSearch} activeOpacity={0.85}>
                <Ionicons name="search" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.guestButtonText}>View My Points</Text>
              </TouchableOpacity>

              <Text style={styles.guestFootnote}>Your data is kept private and secure.</Text>
            </FadeInView>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ==========================================
  // 2. REWARDS DASHBOARD
  // ==========================================
  const progressPercentage = Math.min((points / POINTS_REQUIRED) * 100, 100);

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />
      <HeaderTemp showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO CARD */}
        <FadeInView delay={50}>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>Natureswad Rewards</Text>
                <Text style={styles.heroSub}>
                  {auth().currentUser ? "Your total available balance" : `Guest: +91 ${identifier}`}
                </Text>
                {!auth().currentUser && (
                  <TouchableOpacity onPress={() => setIdentifier(null)} style={styles.changeAccountBtn}>
                    <Ionicons name="swap-horizontal" size={12} color="#FFF" />
                    <Text style={styles.changeAccountText}>Change Account</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.heroIconCircle}>
                <Ionicons name="star" size={26} color="#F57F17" />
              </View>
            </View>

            <View style={styles.pointsDisplay}>
              <Text style={styles.bigNumber}>{loading ? "—" : points}</Text>
              <Text style={styles.pointsLabel}>Points</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressHeaderText}>Next Reward: ₹{DISCOUNT_VALUE} Off</Text>
                <Text style={styles.progressHeaderText}>{points} / {POINTS_REQUIRED} pts</Text>
              </View>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
              </View>
              {points >= POINTS_REQUIRED ? (
                <Text style={styles.rewardReadyText}>🎉 Reward Unlocked! Apply at checkout.</Text>
              ) : (
                <Text style={styles.pointsNeededText}>
                  Earn {POINTS_REQUIRED - points} more points to unlock your ₹{DISCOUNT_VALUE} reward!
                </Text>
              )}
            </View>
          </View>
        </FadeInView>

        {/* HOW IT WORKS */}
        <FadeInView delay={150}>
          <Text style={styles.dashSectionTitle}>How It Works</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <View style={[styles.infoIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="cart-outline" size={24} color="#1B5E20" />
              </View>
              <Text style={styles.infoTitle}>Shop</Text>
              <Text style={styles.infoSub}>Buy organic foods online or in-store.</Text>
            </View>
            <View style={styles.infoBox}>
              <View style={[styles.infoIconCircle, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="sparkles-outline" size={24} color="#F57F17" />
              </View>
              <Text style={styles.infoTitle}>Earn</Text>
              <Text style={styles.infoSub}>25 pts awarded per delivery.</Text>
            </View>
            <View style={styles.infoBox}>
              <View style={[styles.infoIconCircle, { backgroundColor: '#FBE9E7' }]}>
                <Ionicons name="gift-outline" size={24} color="#D84315" />
              </View>
              <Text style={styles.infoTitle}>Redeem</Text>
              <Text style={styles.infoSub}>Save ₹200 for every 200 pts.</Text>
            </View>
          </View>
        </FadeInView>

        {/* HISTORY SECTION */}
        <FadeInView delay={250}>
          <Text style={styles.dashSectionTitle}>Points History</Text>
          
          <View style={styles.historyListCard}>
            {loading ? (
              <View style={styles.emptyHistory}>
                <ActivityIndicator color="#1B5E20" size="large" />
                <Text style={styles.emptyHistoryText}>Loading history...</Text>
              </View>
            ) : history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="receipt-outline" size={36} color="#BDBDBD" />
                </View>
                <Text style={styles.emptyHistoryTitle}>No history yet</Text>
                <Text style={styles.emptyHistoryText}>
                  Make a purchase to start earning points!
                </Text>
              </View>
            ) : (
              history.map((order, index) => (
                <View
                  key={order._id}
                  style={[
                    styles.historyRow,
                    index === history.length - 1 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIconBg}>
                      <Ionicons name="cart-outline" size={18} color="#666" />
                    </View>
                    <View>
                      <Text style={styles.historyOrderId}>
                        Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </Text>
                      <Text style={styles.historyDate}>
                        {new Date(order.createdAt).toDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    {order.pointsEarned > 0 && (
                      <View style={styles.earnedBadge}>
                        <Ionicons name="add" size={11} color="#2E7D32" />
                        <Text style={styles.earnedBadgeText}>{order.pointsEarned} Earned</Text>
                      </View>
                    )}
                    {order.pointsRedeemed > 0 && (
                      <View style={styles.redeemedBadge}>
                        <Text style={styles.redeemedBadgeText}>−{order.pointsRedeemed} Redeemed</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </FadeInView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F4F7F4' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.18, zIndex: 0 },
  blob1: { width: 320, height: 320, backgroundColor: '#FFF9C4', top: -60, right: -110 },
  blob2: { width: 420, height: 420, backgroundColor: '#E8F5E9', bottom: 80, left: -160 },

  // ── Guest Screen ──────────────────────────────────────────
  guestContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  guestInner: {
    alignItems: 'center',
    width: '100%',
  },
  guestIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#F57F17',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  guestTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  // Mini how-it-works row on guest screen
  guestHowItWorksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  guestHowItem: { flex: 1, alignItems: 'center', gap: 8 },
  guestHowIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  guestHowLabel: { fontSize: 11, fontWeight: '700', color: '#444', textAlign: 'center' },
  guestHowDivider: { width: 1, height: 32, backgroundColor: '#EEF2EE' },
  // Input card
  inputCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
    paddingVertical: 4,
  },
  guestButton: {
    flexDirection: 'row',
    backgroundColor: '#1B5E20',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  guestButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  guestFootnote: {
    fontSize: 12,
    color: '#AAB0AA',
    marginTop: 16,
    textAlign: 'center',
  },

  // ── Dashboard ─────────────────────────────────────────────
  scrollContent: { padding: 20, paddingBottom: 60, zIndex: 1 },

  heroCard: {
    backgroundColor: '#1B5E20',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  heroSub: { fontSize: 13, color: '#A5D6A7', marginBottom: 2 },
  changeAccountBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  changeAccountText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', textDecorationLine: 'underline' },
  heroIconCircle: { width: 50, height: 50, backgroundColor: '#FFF8E1', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  
  pointsDisplay: { flexDirection: 'row', alignItems: 'baseline', marginTop: 20, marginBottom: 4 },
  bigNumber: { fontSize: 60, fontWeight: '900', color: '#FFF', marginRight: 10, lineHeight: 68 },
  pointsLabel: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },

  progressContainer: { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressHeaderText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#F57F17', borderRadius: 4 },
  pointsNeededText: { color: '#FFF8E1', fontSize: 12, textAlign: 'center', marginTop: 10, opacity: 0.85, lineHeight: 18 },
  rewardReadyText: { color: '#69F0AE', fontSize: 13, textAlign: 'center', marginTop: 10, fontWeight: '800' },

  // Section title shared
  dashSectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginBottom: 14, marginLeft: 2 },

  // How it works grid
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, gap: 10 },
  infoBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconCircle: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#222', marginBottom: 4, textAlign: 'center' },
  infoSub: { fontSize: 11, color: '#777', textAlign: 'center', lineHeight: 16 },

  // History list
  historyListCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyHistory: { alignItems: 'center', paddingVertical: 44 },
  emptyIconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#F5F7F5', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  emptyHistoryTitle: { fontSize: 16, fontWeight: '800', color: '#444', marginBottom: 6 },
  emptyHistoryText: { color: '#999', fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  historyIconBg: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyOrderId: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  historyDate: { fontSize: 12, color: '#999' },
  
  historyRight: { alignItems: 'flex-end', gap: 6 },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 2,
  },
  earnedBadgeText: { color: '#2E7D32', fontSize: 11, fontWeight: '800' },
  redeemedBadge: {
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  redeemedBadgeText: { color: '#D84315', fontSize: 11, fontWeight: '800' },
});