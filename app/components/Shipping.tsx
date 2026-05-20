import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  Animated
} from 'react-native';
import HeaderTemp from './HeaderTemp';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {children}
    </Animated.View>
  );
};

export default function Shipping() {
  const handleEmailPress = () => Linking.openURL('mailto:support@natureswad.com');

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <FadeInView delay={50}>
          <View style={styles.heroCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="bus" size={32} color="#FFF" />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.mainTitle}>Shipping & Delivery Policy</Text>
              <Text style={styles.subTitle}>Last Updated: March 2026</Text>
            </View>
          </View>
        </FadeInView>

        {/* Intro */}
        <FadeInView delay={150}>
          <View style={styles.guaranteeBanner}>
            <Ionicons name="flash" size={28} color="#00838F" />
            <View style={styles.guaranteeTextContainer}>
              <Text style={styles.guaranteeSubtitle}>
                At Natureswad Foods Private Limited, we aim to deliver your orders quickly and efficiently.
              </Text>
            </View>
          </View>
        </FadeInView>

        {/* Section 1 */}
        <FadeInView delay={250}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="map" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>1. Delivery Areas & Time</Text>
            </View>

            <Text style={styles.paragraph}>
              We currently deliver to selected locations based on service availability. Delivery areas may be expanded over time.
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#1B5E20" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Orders are typically delivered within 2–5 business days.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#1B5E20" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Delivery timelines may vary depending on location, product availability, and external factors.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Section 2 */}
        <FadeInView delay={350}>
          <View style={[styles.sectionCard, styles.highlightCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={24} color="#00838F" />
              <Text style={[styles.sectionTitle, {color: '#006064'}]}>
                2. Charges & Processing
              </Text>
            </View>

            <View style={styles.infoRowContainer}>
              <Ionicons name="time" size={20} color="#00838F" />
              <Text style={styles.infoText}>
                Orders are processed within 24 hours of confirmation.
              </Text>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#00838F" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Delivery charges may apply depending on order value and location.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#00838F" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Free delivery may be offered on orders above a certain amount.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#00838F" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Orders placed on weekends or holidays may be processed on the next working day.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Section 3 */}
        <FadeInView delay={450}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={24} color="#D84315" />
              <Text style={styles.sectionTitle}>3. Delays & Tracking</Text>
            </View>

            <Text style={styles.paragraph}>
              Delivery may be delayed due to:
            </Text>

            <View style={styles.conditionsGrid}>
              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="rainy" size={16} color="#D84315" />
                </View>
                <Text style={styles.conditionText}>Weather conditions</Text>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="car" size={16} color="#D84315" />
                </View>
                <Text style={styles.conditionText}>Logistics issues</Text>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="stats-chart" size={16} color="#D84315" />
                </View>
                <Text style={styles.conditionText}>High demand periods</Text>
              </View>
            </View>

            <View style={styles.noticeBox}>
              <Ionicons name="information-circle" size={20} color="#D84315" />
              <Text style={styles.noticeBoxText}>
                Natureswad is not liable for delays caused by third-party delivery partners.
              </Text>
            </View>

            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              <Text style={styles.bold}>Order Tracking:</Text> Users may receive updates via SMS, email, or app notifications regarding their order status.
            </Text>
          </View>
        </FadeInView>

        {/* Section 4 */}
        <FadeInView delay={550}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="close-circle" size={24} color="#D84315" />
              <Text style={styles.sectionTitle}>4. Failed Delivery</Text>
            </View>

            <Text style={styles.paragraph}>
              If delivery fails due to incorrect address or unavailability of the recipient:
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  The order may be cancelled
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Refunds will be processed as per refund policy
                </Text>
              </View>
            </View>

            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Ionicons name="headset" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>5. Contact Us</Text>
            </View>

            <Text style={styles.paragraph}>
              For any shipping-related queries:
            </Text>

            <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
              <Ionicons name="mail" size={20} color="#FFF" />
              <Text style={styles.emailButtonText}>support@natureswad.com</Text>
            </TouchableOpacity>

            <Text style={[styles.paragraph, { marginTop: 24, textAlign: 'center', fontSize: 12 }]}>
              By placing an order, you agree to this Shipping Policy.
            </Text>
          </View>
        </FadeInView>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

// ---- STYLES (UNCHANGED) ----
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3 },
  blob1: { width: 300, height: 300, backgroundColor: '#E0F7FA', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },

  scrollContainer: { padding: 16, paddingBottom: 40 },

  heroCard: { backgroundColor: '#006064', borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  headerContent: { flex: 1 },
  mainTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  subTitle: { fontSize: 13, color: '#B2EBF2' },

  guaranteeBanner: { flexDirection: 'row', padding: 16, borderRadius: 20, marginBottom: 16, backgroundColor: '#E0F7FA' },
  guaranteeTextContainer: { flex: 1, marginLeft: 12 },
  guaranteeSubtitle: { fontSize: 14, color: '#00838F' },

  sectionCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 16 },
  highlightCard: { backgroundColor: '#E0F7FA', borderWidth: 1, borderColor: '#B2EBF2' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 10 },

  paragraph: { marginBottom: 12 },
  bold: { fontWeight: '800' },

  bulletList: { marginTop: 8 },
  bulletItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  bulletDot: { marginTop: 6 },
  bulletText: { marginLeft: 10 },

  infoRowContainer: { flexDirection: 'row', marginBottom: 12 },
  infoText: { marginLeft: 8 },

  conditionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  conditionItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
  conditionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFCCBC', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  conditionText: { fontSize: 13, color: '#BF360C', flex: 1 },

  noticeBox: { flexDirection: 'row', marginTop: 10 },
  noticeBoxText: { marginLeft: 10 },

  emailButton: { flexDirection: 'row', justifyContent: 'center', padding: 16, backgroundColor: '#1B5E20', borderRadius: 20 },
  emailButtonText: { color: '#FFF', marginLeft: 10 }
});