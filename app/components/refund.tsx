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

export default function Refund() {
  const handleEmailPress = () => Linking.openURL('mailto:support@natureswad.com');

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <HeaderTemp showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <FadeInView delay={50}>
          <View style={styles.heroCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="refresh-circle" size={36} color="#FFF" />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.mainTitle}>Returns & Refund Policy</Text>
              <Text style={styles.subTitle}>Last Updated: March 2026</Text>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={150}>
          <View style={styles.guaranteeBanner}>
            <Ionicons name="shield-checkmark" size={28} color="#2E7D32" />
            <View style={styles.guaranteeTextContainer}>
              <Text style={styles.guaranteeSubtitle}>
                At Natureswad Foods Private Limited, we aim to provide high-quality products and a seamless shopping experience.
              </Text>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={250}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="close-circle" size={24} color="#D84315" />
              <Text style={styles.sectionTitle}>1. Order Cancellation</Text>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Orders can be cancelled only before they are processed or dispatched.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Once an order is confirmed and processed, it cannot be cancelled.
                </Text>
              </View>
            </View>

            <View style={[styles.sectionHeader, { marginTop: 16 }]}>
              <Ionicons name="cash" size={24} color="#D84315" />
              <Text style={styles.sectionTitle}>2. Cash on Delivery (COD)</Text>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  COD orders can be cancelled before dispatch only.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#D84315" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Repeated cancellations may lead to restriction of COD services.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={350}>
          <View style={[styles.sectionCard, styles.conditionsCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>3. Refund Policy</Text>
            </View>

            <Text style={styles.paragraph}>
              Refunds will be issued only in the following cases:
            </Text>

            <View style={styles.conditionsGrid}>
              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="checkmark" size={16} color="#2E7D32" />
                </View>
                <Text style={styles.conditionText}>Failed or unsuccessful online payment</Text>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="checkmark" size={16} color="#2E7D32" />
                </View>
                <Text style={styles.conditionText}>Incorrect item delivered</Text>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="checkmark" size={16} color="#2E7D32" />
                </View>
                <Text style={styles.conditionText}>Damaged or defective product received</Text>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionIcon}>
                  <Ionicons name="checkmark" size={16} color="#2E7D32" />
                </View>
                <Text style={styles.conditionText}>Order not delivered</Text>
              </View>
            </View>

            <View style={styles.infoRowContainer}>
              <Ionicons name="time" size={20} color="#33691E" />
              <Text style={styles.infoText}>
                Approved refunds will be processed within 5–7 business days.
              </Text>
            </View>

            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Ionicons name="card" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>4. Refund Method</Text>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#2E7D32" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Refunds will be credited to the original payment method.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <Ionicons name="ellipse" size={6} color="#030403" style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  For COD orders, refunds (if applicable) will be processed via bank transfer or store credit.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={450}>
          <View style={[styles.sectionCard, styles.nonReturnableCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={24} color="#D84315" />
              <Text style={[styles.sectionTitle, {color: '#D84315'}]}>
                5. Non-Returnable Items
              </Text>
            </View>

            <Text style={styles.paragraph}>
              Due to the nature of our products, we do not accept returns for:
            </Text>

            <View style={styles.nonReturnItem}>
              <Ionicons name="remove-circle" size={18} color="#D84315" />
              <Text style={styles.nonReturnText}>Food items and consumables</Text>
            </View>

            <View style={styles.nonReturnItem}>
              <Ionicons name="remove-circle" size={18} color="#D84315" />
              <Text style={styles.nonReturnText}>Opened or used products</Text>
            </View>

            <View style={styles.nonReturnItem}>
              <Ionicons name="remove-circle" size={18} color="#D84315" />
              <Text style={styles.nonReturnText}>Perishable goods</Text>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={550}>
          <View style={[styles.sectionCard, { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="headset" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>6. Reporting Issues</Text>
            </View>

            <Text style={styles.paragraph}>
              If you receive a damaged or incorrect product, you must notify us within 24 hours of delivery.
            </Text>

            <View style={[styles.sectionHeader, { marginTop: 16 }]}>
              <Ionicons name="mail" size={24} color="#1B5E20" />
              <Text style={styles.sectionTitle}>7. Contact Us</Text>
            </View>

            <Text style={styles.paragraph}>
              For any refund or cancellation queries:
            </Text>

            <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
              <Ionicons name="mail" size={20} color="#FFF" />
              <Text style={styles.emailButtonText}>support@natureswad.com</Text>
            </TouchableOpacity>

            <Text style={[styles.paragraph, { marginTop: 24, textAlign: 'center', fontSize: 12 }]}>
              By placing an order with Natureswad, you agree to this policy.
            </Text>
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
  blob2: { width: 400, height: 400, backgroundColor: '#FFEBEE', bottom: 100, left: -150 },

  scrollContainer: { padding: 16, paddingBottom: 40 },

  heroCard: {
    backgroundColor: '#3E2723',
    borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center',
    marginBottom: 16, shadowColor: '#3E2723', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 15, elevation: 8,
  },
  iconContainer: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  headerContent: { flex: 1 },
  mainTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  subTitle: { fontSize: 13, color: '#D7CCC8' },

  guaranteeBanner: {
    backgroundColor: '#E8F5E9', flexDirection: 'row', alignItems: 'center',
    padding: 16, borderRadius: 20, marginBottom: 16,
  },
  guaranteeTextContainer: { flex: 1, marginLeft: 12 },
  guaranteeSubtitle: { fontSize: 14, color: '#2E7D32' },

  sectionCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 16,
  },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 10 },

  paragraph: { fontSize: 14, marginBottom: 16 },

  bulletList: { marginTop: 8 },
  bulletItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  bulletDot: { marginTop: 6, marginRight: 4 },
  bulletText: { marginLeft: 6, flex: 1, fontSize: 14, color: '#444' },

  conditionsCard: { backgroundColor: '#F1F8E9', borderWidth: 1, borderColor: '#C8E6C9' },
  conditionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  conditionItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
  conditionIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C8E6C9', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  conditionText: { fontSize: 13, color: '#2E7D32', flex: 1 },

  infoRowContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCEDC8', padding: 12, borderRadius: 12, marginBottom: 16 },
  infoText: { marginLeft: 8, fontSize: 13, color: '#33691E', flex: 1 },

  nonReturnableCard: { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFCCBC' },
  nonReturnItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  nonReturnText: { marginLeft: 10, fontSize: 14, color: '#BF360C' },

  emailButton: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20
  },
  emailButtonText: { color: '#FFF', marginLeft: 10 },
});