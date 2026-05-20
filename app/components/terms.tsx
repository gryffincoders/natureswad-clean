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

export default function Terms() {
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
              <Ionicons name="document-text" size={32} color="#FFF" />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.mainTitle}>Terms & Conditions</Text>
              <Text style={styles.subTitle}>Last Updated: March 2026</Text>
            </View>
          </View>
        </FadeInView>

        {/* Agreement */}
        <FadeInView delay={150}>
          <View style={styles.agreementNotice}>
            <Ionicons name="warning" size={22} color="#E65100" />
            <Text style={styles.agreementText}>
              By accessing or using our services, you agree to be bound by these terms.
            </Text>
          </View>
        </FadeInView>

        {/* Section 1 */}
        <FadeInView delay={250}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="globe" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>1. Welcome & Usage</Text>
            </View>

            <Text style={styles.paragraph}>
              Welcome to Natureswad Foods Private Limited. These Terms govern your use of our mobile application, website, and services. You agree to use our platform only for lawful purposes.
            </Text>

            <View style={styles.restrictionsContainer}>
              <Text style={styles.restrictionsTitle}>User Conduct (You Must NOT):</Text>

              <View style={styles.restrictionItem}>
                <Ionicons name="close-circle" size={18} color="#E65100" />
                <Text style={styles.restrictionText}>
                  Misuse the application or attempt unauthorized access
                </Text>
              </View>

              <View style={styles.restrictionItem}>
                <Ionicons name="close-circle" size={18} color="#E65100" />
                <Text style={styles.restrictionText}>
                  Use the platform for illegal activities
                </Text>
              </View>

              <View style={styles.restrictionItem}>
                <Ionicons name="close-circle" size={18} color="#E65100" />
                <Text style={styles.restrictionText}>
                  Post harmful, offensive, or misleading content
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Section 2 */}
        <FadeInView delay={350}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="wallet" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>2. Accounts & Payments</Text>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="person" size={20} color="#2E7D32" />
              <Text style={styles.infoBoxText}>
                Users must provide personal info (name, email). You are responsible for account confidentiality. Natureswad is not liable for unauthorized access.
              </Text>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  All prices are in INR (₹) and subject to change without notice.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Online payments are processed securely via Razorpay. We do not store any card, UPI, or banking details.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  COD orders are subject to confirmation. Repeated cancellations may restrict COD services.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Section 3 */}
        <FadeInView delay={450}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cube" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>3. Shipping & Refunds</Text>
            </View>

            <Text style={styles.paragraph}>
              Delivery timelines depend on location. Delays may occur due to weather or logistics. We are not liable for third-party delivery delays.
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Orders can only be cancelled before they are processed.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#33691E" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Refunds (if applicable) will be processed within 5–7 business days.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Section 4 */}
        <FadeInView delay={550}>
          <View style={[styles.sectionCard, styles.licenseCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="scale" size={24} color="#E65100" />
              <Text style={[styles.sectionTitle, {color: '#E65100'}]}>
                4. Legal & Liability
              </Text>
            </View>

            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Intellectual Property:</Text> All content, branding, and logos are owned by Natureswad Foods Private Limited.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Third-Party Services:</Text> We use Razorpay and Firebase. We are not responsible for third-party disruptions.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Limitation of Liability:</Text> We shall not be liable for indirect damages, loss of data, or business revenue.
            </Text>

            <View style={styles.freeServiceNotice}>
              <Ionicons name="information-circle" size={20} color="#1B5E20" />
              <Text style={styles.freeServiceText}>
                Governed by the laws of India (Bengaluru, Karnataka jurisdiction).
              </Text>
            </View>
          </View>
        </FadeInView>

        {/* Section 5 */}
        <FadeInView delay={650}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="settings" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>5. Account & Policies</Text>
            </View>

            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Modifications:</Text> We reserve the right to update these Terms at any time. Continued use constitutes acceptance.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Account Deletion:</Text> Users may request permanent data deletion via in-app settings or email, subject to legal requirements.
            </Text>

            <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
              <Ionicons name="mail" size={20} color="#FFF" />
              <Text style={styles.emailButtonText}>support@natureswad.com</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

// ---- STYLES (unchanged) ----
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E3F2FD', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  heroCard: { backgroundColor: '#0D47A1', borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  headerContent: { flex: 1 },
  mainTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  subTitle: { fontSize: 13, color: '#BBDEFB' },
  agreementNotice: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF3E0', borderRadius: 20 },
  agreementText: { marginLeft: 12 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 16 },
  licenseCard: { backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#FFCC80' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 10 },
  paragraph: { marginBottom: 12 },
  bold: { fontWeight: '800' },
  bulletList: {},
  bulletItem: { flexDirection: 'row', marginBottom: 10 },
  bulletDot: { marginTop: 6 },
  bulletText: { marginLeft: 10 },
  restrictionItem: { flexDirection: 'row', marginBottom: 8 },
  restrictionText: { marginLeft: 10 },
  restrictionsContainer: { marginTop: 10 },
  restrictionsTitle: { fontWeight: '800', marginBottom: 8 },
  infoBox: { flexDirection: 'row', marginBottom: 12 },
  infoBoxText: { marginLeft: 10 },
  freeServiceNotice: { flexDirection: 'row', marginTop: 10 },
  freeServiceText: { marginLeft: 10 },
  emailButton: { flexDirection: 'row', justifyContent: 'center', padding: 16, backgroundColor: '#1B5E20', borderRadius: 20 },
  emailButtonText: { color: '#FFF', marginLeft: 10 }
});