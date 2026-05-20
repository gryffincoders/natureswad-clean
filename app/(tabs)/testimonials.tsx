import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import HeaderTemp from '../components/HeaderTemp';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

/* ------------------ DATA ------------------ */

const TESTIMONIALS = [
  {
    id: 'oTPwvJ4Hx4o',
    title: 'Diabetic Care Results',
    customer: 'Ramesh Kumar',
    quote: "I've seen a real difference in my health. Highly recommended!",
    date: '2 weeks ago',
  },
  {
    id: 'EvyqVigBtuo',
    title: 'DCA Customer Story',
    customer: 'Priya Sharma',
    quote: "The quality is unmatched. Truly nature's goodness.",
    date: '1 month ago',
  },
  {
    id: 'vRUssHRnP4Y',
    title: 'Diabetic Care Atta Review',
    customer: 'Ashwathamma',
    quote: 'Healthy and tasty. Ordering again!',
    date: '2 months ago',
  },
];

/* ------------------ ANIMATED COMPONENT ------------------ */

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

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

/* ------------------ MAIN SCREEN ------------------ */

export default function Testimonials() {
  const [playing, setPlaying] = useState<string | null>(null);
  const router = useRouter();

  const FARMER_VIDEO_ID = 'oMy_3E8_O6s'; // Your specific YouTube ID

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') setPlaying(null);
  }, []);

  const togglePlaying = (id: string) => {
    setPlaying((prev) => (prev === id ? null : id));
  };

  const openInYouTube = (id: string) => {
    const url = `https://www.youtube.com/watch?v=${id}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open YouTube')
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* --- AMBIENT SUBTLE BACKGROUND BLOBS --- */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HERO SECTION --- */}
        <FadeInView delay={50}>
          <View style={styles.heroSection}>
            <Text style={styles.pageTitle}>Our Community</Text>
            <View style={styles.divider} />
            <Text style={styles.pageSubTitle}>
              Real people. Real impact. Real swad.
            </Text>
          </View>
        </FadeInView>

        {/* --- CUSTOMER STORIES HEADER --- */}
        <FadeInView delay={100}>
          <Text style={styles.sectionHeading}>Customer Stories</Text>
        </FadeInView>

        {/* --- TESTIMONIAL CARDS (Moved up!) --- */}
        {TESTIMONIALS.map((item, index) => (
          <FadeInView key={item.id} delay={150 + (index * 100)}>
            <View style={styles.card}>
              
              {/* -------- VIDEO WRAPPER -------- */}
              <View style={styles.videoWrapper}>
                {isWeb ? (
                  <TouchableOpacity
                    style={styles.webFallback}
                    onPress={() => openInYouTube(item.id)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="logo-youtube" size={56} color="#FF0000" />
                    <Text style={styles.webFallbackText}>Watch on YouTube</Text>
                  </TouchableOpacity>
                ) : (
                  <YoutubePlayer
                    height={220}
                    videoId={item.id}
                    play={playing === item.id}
                    onChangeState={onStateChange}
                    forceAndroidAutoplay
                    initialPlayerParams={{
                      controls: false,
                      modestbranding: true,
                      preventFullScreen: false,
                    }}
                  />
                )}

                {/* Overlay (mobile only) */}
                {!isWeb && playing !== item.id && (
                  <View style={styles.playOverlay}>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => togglePlaying(item.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="play" size={32} color="#2E7D32" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.ytShortcut}
                      onPress={() => openInYouTube(item.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                      <Text style={styles.ytShortcutText}>WATCH ON YOUTUBE</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* -------- CARD CONTENT -------- */}
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                
                <Text style={styles.customerName}>By {item.customer}</Text>
                
                {/* Modern Blockquote */}
                <View style={styles.quoteBox}>
                  <Ionicons name="chatbubbles" size={20} color="#AED581" style={styles.quoteIcon} />
                  <Text style={styles.quote}>"{item.quote}"</Text>
                </View>

                {/* Footer Badges */}
                <View style={styles.footerRow}>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={16} color="#2E7D32" />
                    <Text style={styles.verifiedText}>Verified Purchase</Text>
                  </View>
                </View>

              </View>
            </View>
          </FadeInView>
        ))}

        {/* --- STRAIGHT FROM FARMERS FEATURED VIDEO (Moved down!) --- */}
        <FadeInView delay={500}>
          <View style={[styles.card, styles.farmerCard, { marginTop: 16 }]}>
            <View style={styles.farmerHeader}>
              <View style={styles.farmerTitleRow}>
                <Ionicons name="leaf" size={24} color="#2E7D32" />
                <Text style={styles.farmerTitle}>Straight from Farmers</Text>
              </View>
              <Text style={styles.farmerSubText}>
                See how your purchases directly empower local farming communities and promote sustainable agriculture.
              </Text>
            </View>

            {/* -------- VIDEO WRAPPER -------- */}
            <View style={styles.videoWrapper}>
              {isWeb ? (
                <TouchableOpacity
                  style={styles.webFallback}
                  onPress={() => openInYouTube(FARMER_VIDEO_ID)}
                  activeOpacity={0.9}
                >
                  <Ionicons name="logo-youtube" size={56} color="#FF0000" />
                  <Text style={styles.webFallbackText}>Watch on YouTube</Text>
                </TouchableOpacity>
              ) : (
                <YoutubePlayer
                  height={220}
                  videoId={FARMER_VIDEO_ID}
                  play={playing === FARMER_VIDEO_ID}
                  onChangeState={onStateChange}
                  forceAndroidAutoplay
                  initialPlayerParams={{
                    controls: false,
                    modestbranding: true,
                    preventFullScreen: false,
                  }}
                />
              )}

              {!isWeb && playing !== FARMER_VIDEO_ID && (
                <View style={styles.playOverlay}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => togglePlaying(FARMER_VIDEO_ID)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="play" size={32} color="#2E7D32" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.ytShortcut}
                    onPress={() => openInYouTube(FARMER_VIDEO_ID)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                    <Text style={styles.ytShortcutText}>WATCH ON YOUTUBE</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </FadeInView>

      </ScrollView>
    </View>
  );
}

/* ------------------ STYLES ------------------ */

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
    bottom: 200, left: -150,
  },

  scrollContent: { 
    padding: 16,
    paddingBottom: 40,
  },

  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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

  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 10,
    marginLeft: 4,
  },

  // --- Farmer Featured Card ---
  farmerCard: {
    borderWidth: 2,
    borderColor: '#C8E6C9',
    backgroundColor: '#F1F8E9',
  },
  farmerHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  farmerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1B5E20',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif',
  },
  farmerSubText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    fontWeight: '500',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden', 
  },

  videoWrapper: {
    height: 220,
    backgroundColor: '#111',
    position: 'relative',
  },

  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  ytShortcut: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  ytShortcutText: {
    color: '#111',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.5,
  },

  webFallback: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  webFallbackText: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  cardContent: {
    padding: 20,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  videoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 10,
  },
  
  date: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginTop: 3,
  },

  customerName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },

  quoteBox: {
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    overflow: 'hidden',
  },
  quote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 22,
    fontWeight: '500',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  verifiedText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
  },
});