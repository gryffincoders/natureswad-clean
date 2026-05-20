import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import HeaderTemp from './HeaderTemp';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- REUSABLE ANIMATED COMPONENT ---
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

export default function Privacy() {
  return (
    <View style={styles.mainContainer}>
      {/* --- AMBIENT SUBTLE BACKGROUND BLOBS --- */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Premium Floating Header */}
        <FadeInView delay={50}>
          <View style={styles.heroCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={32} color="#FFF" />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.mainTitle}>Privacy Policy</Text>
              <Text style={styles.subTitle}>Last Updated: March 2026</Text>
            </View>
          </View>
        </FadeInView>

        {/* Introduction Card */}
        <FadeInView delay={150}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color="#33691E" />
              <Text style={styles.sectionTitle}>Policy Overview</Text>
            </View>
            <Text style={styles.paragraph}>
              <Text style={styles.highlight}>Natureswad Foods Private Limited</Text> ("Natureswad", "we", "our", "us") operates both a mobile application and website.
            </Text>
            <Text style={styles.paragraph}>
              This Privacy Policy explains how we collect, use, and protect your information. By using our services, you agree to this Privacy Policy.
            </Text>
          </View>
        </FadeInView>

        {/* Data Collection Card */}
        <FadeInView delay={250}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-download" size={24} color="#33691E" />
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            </View>
            <Text style={styles.paragraph}>
              We may collect:
            </Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>Name, phone number, email address</Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>Delivery address and order details</Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>Device and usage data</Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>IP address and app interactions</Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Purpose Card */}
        <FadeInView delay={350}>
          <View style={[styles.sectionCard, styles.importantCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flag" size={24} color="#D84315" />
              <Text style={[styles.sectionTitle, styles.importantTitle]}>2. How We Use Your Data</Text>
            </View>
            <Text style={styles.paragraph}>
              We use your data to:
            </Text>
            <View style={styles.featureGrid}>
              <View style={styles.featureBox}>
                <Ionicons name="card" size={24} color="#D84315" />
                <Text style={styles.featureText}>Process and deliver orders</Text>
              </View>
              <View style={styles.featureBox}>
                <Ionicons name="chatbubbles" size={24} color="#D84315" />
                <Text style={styles.featureText}>Provide customer support</Text>
              </View>
              <View style={styles.featureBox}>
                <Ionicons name="stats-chart" size={24} color="#D84315" />
                <Text style={styles.featureText}>Improve app performance</Text>
              </View>
              <View style={styles.featureBox}>
                <Ionicons name="notifications" size={24} color="#D84315" />
                <Text style={styles.featureText}>Send order updates and notifications</Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Third-Party & Security Card */}
        <FadeInView delay={450}>
          <View style={[styles.sectionCard, styles.securityCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed" size={24} color="#FFF" />
              <Text style={[styles.sectionTitle, styles.whiteText]}>3. Third-Party Services & 4. Data Security</Text>
            </View>
            <Text style={[styles.paragraph, styles.whiteText]}>
              We use:
            </Text>
            <View style={styles.securityFeatures}>
              <View style={styles.securityItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={[styles.securityText, styles.whiteText]}>Firebase (authentication and analytics)</Text>
              </View>
              <View style={styles.securityItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={[styles.securityText, styles.whiteText]}>Razorpay (secure payment processing)</Text>
              </View>
            </View>
            <View style={[styles.infoBox, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', marginTop: 10 }]}>
              <Text style={[styles.infoBoxText, styles.whiteText]}>
                We do not store card or banking details.
              </Text>
            </View>
            <Text style={[styles.paragraph, styles.whiteText, { marginTop: 16 }]}>
              We implement appropriate security measures to protect your data. However, no system is completely secure.
            </Text>
          </View>
        </FadeInView>

        {/* Policies & Rights Card */}
        <FadeInView delay={550}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="finger-print" size={24} color="#33691E" />
              <Text style={styles.sectionTitle}>User Rights & Additional Policies</Text>
            </View>
            
            <View style={styles.rightsGrid}>
              <View style={styles.rightItem}>
                <View style={styles.rightIcon}>
                  <Ionicons name="trash" size={18} color="#33691E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>5. Data Retention & Deletion</Text>
                  <Text style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Users can request account or data deletion by contacting support@natureswad.com. Data will be deleted unless required legally.</Text>
                </View>
              </View>

              <View style={styles.rightItem}>
                <View style={styles.rightIcon}>
                  <Ionicons name="person" size={18} color="#33691E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>6. User Rights</Text>
                  <Text style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Users can access, update, or delete their personal data.</Text>
                </View>
              </View>

              <View style={styles.rightItem}>
                <View style={styles.rightIcon}>
                  <Ionicons name="body" size={18} color="#33691E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>7. Children’s Privacy</Text>
                  <Text style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Our services are not intended for children under 13 years of age.</Text>
                </View>
              </View>

              <View style={styles.rightItem}>
                <View style={styles.rightIcon}>
                  <Ionicons name="settings" size={18} color="#33691E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>8. Permissions</Text>
                  <Text style={{ fontSize: 13, color: '#555', marginTop: 4 }}>We may request permissions only when necessary for app functionality.</Text>
                </View>
              </View>

              <View style={styles.rightItem}>
                <View style={styles.rightIcon}>
                  <Ionicons name="refresh" size={18} color="#33691E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>9. Changes to Policy</Text>
                  <Text style={{ fontSize: 13, color: '#555', marginTop: 4 }}>We may update this policy from time to time.</Text>
                </View>
              </View>
            </View>
            
            <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 10 }]}>10. Contact Us</Text>
            <TouchableOpacity style={styles.emailButton} activeOpacity={0.8}>
              <Ionicons name="mail" size={18} color="#FFF" />
              <Text style={styles.emailButtonText}>Email: support@natureswad.com</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },

  scrollContainer: { padding: 16, paddingBottom: 40 },

  heroCard: {
    backgroundColor: '#1B5E20',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  iconContainer: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: { flex: 1 },
  mainTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: 0.5, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif', marginBottom: 4 },
  subTitle: { fontSize: 13, color: '#C8E6C9', fontWeight: '500', letterSpacing: 0.3 },

  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)',
  },
  importantCard: { backgroundColor: '#FFF8E1', borderColor: '#FFECB3' },
  securityCard: { backgroundColor: '#263238', borderColor: '#37474F' },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1B5E20', marginLeft: 10, letterSpacing: 0.3 },
  importantTitle: { color: '#D84315' },
  whiteText: { color: '#FFF' },
  
  paragraph: { fontSize: 14, lineHeight: 22, color: '#555', marginBottom: 16, fontWeight: '500' },
  highlight: { color: '#2E7D32', fontWeight: '700', backgroundColor: '#F1F8E9', paddingHorizontal: 4, borderRadius: 4 },
  bold: { fontWeight: '800', color: '#1A1A1A' },
  
  bulletList: { marginBottom: 16, paddingLeft: 4 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bulletDot: { marginTop: 6 },
  bulletText: { fontSize: 14, color: '#444', marginLeft: 10, flex: 1, lineHeight: 20 },
  
  infoBox: { backgroundColor: '#F1F8E9', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#C8E6C9' },
  infoBoxText: { color: '#1B5E20', fontSize: 13, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5, lineHeight: 20 },
  
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
  featureBox: { width: '48%', backgroundColor: '#FFF', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  featureText: { fontSize: 13, color: '#D84315', fontWeight: '700', marginTop: 8, textAlign: 'center' },
  
  rightsGrid: { flexDirection: 'column', marginBottom: 16 },
  rightItem: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#F8F9FA', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  rightIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  
  emailButton: { backgroundColor: '#1B5E20', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 20, marginTop: 8, shadowColor: '#1B5E20', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  emailButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700', marginLeft: 10, letterSpacing: 0.5 },
  
  securityFeatures: { marginTop: 10 },
  securityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  securityText: { fontSize: 14, marginLeft: 12, fontWeight: '600', flex: 1 },
});