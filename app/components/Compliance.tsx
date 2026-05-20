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

// Animation Component
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

export default function Compliance() {
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
              <Ionicons name="shield-checkmark" size={32} color="#FFF" />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.mainTitle}>App Compliance</Text>
              <Text style={styles.subTitle}>Last Updated: March 2026</Text>
            </View>
          </View>
        </FadeInView>

        {/* Account Deletion */}
        <FadeInView delay={150}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trash" size={24} color="#D84315" />
              <Text style={styles.sectionTitle}>1. Account Deletion Policy</Text>
            </View>

            <Text style={styles.paragraph}>
              Users have the right to request deletion of their account and personal data.
            </Text>

            <View style={styles.bulletItem}>
              <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
              <Text style={styles.bulletText}>Request via in-app settings (if available)</Text>
            </View>

            <View style={styles.bulletItem}>
              <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
              <Text style={styles.bulletText}>Or email support@natureswad.com</Text>
            </View>

            <Text style={styles.paragraph}>
              Upon request:
            </Text>

            <View style={styles.bulletItem}>
              <Ionicons name="checkmark" size={16} color="#2E7D32" />
              <Text style={styles.bulletText}>All personal data will be permanently deleted</Text>
            </View>

            <View style={styles.bulletItem}>
              <Ionicons name="checkmark" size={16} color="#2E7D32" />
              <Text style={styles.bulletText}>
                Some data may be retained for legal or financial compliance
              </Text>
            </View>

            <Text style={styles.infoText}>
              Deletion requests are processed within 5–7 business days.
            </Text>
          </View>
        </FadeInView>

        {/* Data Safety */}
        <FadeInView delay={250}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>2. Data Safety Declaration</Text>
            </View>

            <Text style={styles.subHeading}>Collected Data:</Text>

            <Text style={styles.bold}>• Personal Information:</Text>
            <Text style={styles.paragraph}>Name, phone number, email address</Text>

            <Text style={styles.bold}>• Usage Data:</Text>
            <Text style={styles.paragraph}>App interactions, device information</Text>

            <Text style={styles.bold}>• Order Data:</Text>
            <Text style={styles.paragraph}>Delivery address, order history</Text>

            <Text style={styles.subHeading}>Purpose:</Text>

            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
              <Text style={styles.bulletText}>Order processing & delivery</Text>
            </View>

            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
              <Text style={styles.bulletText}>Customer support</Text>
            </View>

            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
              <Text style={styles.bulletText}>Improve app performance</Text>
            </View>

            <Text style={styles.subHeading}>Third-Party Services:</Text>

            <Text style={styles.paragraph}>• Firebase (Authentication & Analytics)</Text>
            <Text style={styles.paragraph}>• Razorpay (Payment Processing)</Text>

            <Text style={styles.paragraph}>
              We do not sell or share personal data with unauthorized third parties.
            </Text>

            <Text style={styles.paragraph}>
              All data is securely stored and protected.
            </Text>
          </View>
        </FadeInView>

        {/* Test Credentials */}
        <FadeInView delay={350}>
          <View style={[styles.sectionCard, styles.highlightCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="key" size={24} color="#006064" />
              <Text style={[styles.sectionTitle, { color: '#006064' }]}>
                3. Test Login Credentials
              </Text>
            </View>

            <Text style={styles.paragraph}>
              For app review purposes:
            </Text>

            <View style={styles.credentialBox}>
              <Text style={styles.credentialText}>Phone: 9999999999</Text>
              <Text style={styles.credentialText}>OTP / Password: 123456</Text>
            </View>
          </View>
        </FadeInView>

        {/* Contact */}
        <FadeInView delay={450}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="mail" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>4. Contact Information</Text>
            </View>

            <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
              <Ionicons name="mail" size={20} color="#FFF" />
              <Text style={styles.emailButtonText}>support@natureswad.com</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },

  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#E0F7FA', bottom: 100, left: -150 },

  scrollContainer: { padding: 16, paddingBottom: 40 },

  heroCard: {
    backgroundColor: '#2E7D32',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },

  headerContent: { flex: 1 },
  mainTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  subTitle: { fontSize: 13, color: '#C8E6C9' },

  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16
  },

  highlightCard: { backgroundColor: '#E0F7FA' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 10 },

  paragraph: { fontSize: 14, marginBottom: 10, color: '#555' },
  bold: { fontWeight: '800', marginTop: 6 },
  subHeading: { fontSize: 15, fontWeight: '700', marginTop: 10 },

  bulletItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bulletDot: { marginRight: 8 },
  bulletText: { marginLeft: 8 },

  infoText: { marginTop: 10, fontWeight: '600', color: '#2E7D32' },

  credentialBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 10
  },
  credentialText: { fontSize: 14, fontWeight: '700', marginBottom: 6 },

  emailButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1B5E20',
    borderRadius: 20
  },
  emailButtonText: { color: '#FFF', marginLeft: 10 }
});