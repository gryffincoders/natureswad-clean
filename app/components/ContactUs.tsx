// app/components/ContactUs.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Linking,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderTemp from './HeaderTemp';

const { width } = Dimensions.get('window');

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

export default function ContactUs() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Helper to open email with specific data
  const openEmailClient = (subject = '', body = '') => {
    const email = 'sales@natureswad.com';
    const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const url = `mailto:${email}?${query}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'No email client available on this device');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // 2. Logic for the direct email button
  const handleDirectEmail = () => {
    openEmailClient('Inquiry about Natureswad', 'Hello, I would like to inquire about...');
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields marked with *');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // 3. Construct the email body from form data
    const emailSubject = `Inquiry from ${formData.firstName} ${formData.lastName}`;
    const emailBody = `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;

    try {
      openEmailClient(emailSubject, emailBody);
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not open email client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.mainContainer}>
      {/* --- AMBIENT SUBTLE BACKGROUND BLOBS --- */}
      <View style={[styles.bgBlob, styles.blob1]} />
      <View style={[styles.bgBlob, styles.blob2]} />

      <SafeAreaView style={styles.safeArea}>
        <HeaderTemp showBack={true} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            
            {/* Premium Floating Header */}
            <FadeInView delay={50}>
              <View style={styles.premiumHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="chatbubble-ellipses" size={32} color="#FFF" />
                </View>
                <View style={styles.headerContent}>
                  <Text style={styles.mainTitle}>Contact Us</Text>
                  <Text style={styles.subTitle}>We're here to help you</Text>
                </View>
              </View>
            </FadeInView>

            {/* Hero Banner Card */}
            <FadeInView delay={150}>
              <View style={styles.heroCard}>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>Say Hello!</Text>
                  <Text style={styles.heroSubtitle}>
                    We're a friendly bunch here at Natureswad. Place an inquiry and we'll get back to you the same day.
                  </Text>
                </View>

                {/* Direct Email Button */}
                <TouchableOpacity style={styles.emailButton} onPress={handleDirectEmail} activeOpacity={0.8}>
                  <Ionicons name="mail" size={20} color="#FFF" />
                  <Text style={styles.emailButtonText}>sales@natureswad.com</Text>
                  <Ionicons name="open-outline" size={18} color="#FFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            </FadeInView>

            {/* Form Card */}
            <FadeInView delay={250}>
              <View style={styles.formCard}>
                
                <View style={styles.inputRow}>
                  {/* First Name Field */}
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                    <Text style={styles.inputLabel}>
                      First Name<Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="John"
                      value={formData.firstName}
                      onChangeText={(text) => updateFormData('firstName', text)}
                      placeholderTextColor="#999"
                    />
                  </View>

                  {/* Last Name Field */}
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Doe"
                      value={formData.lastName}
                      onChangeText={(text) => updateFormData('lastName', text)}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Email Address<Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputWithIcon}>
                    <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="hello@example.com"
                      value={formData.email}
                      onChangeText={(text) => updateFormData('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Message Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Your Message<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.messageInput]}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChangeText={(text) => updateFormData('message', text)}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <Ionicons name="refresh" size={24} color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Send Message</Text>
                      <Ionicons name="paper-plane-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </TouchableOpacity>

              </View>
            </FadeInView>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  safeArea: { flex: 1 },
  
  // Ambient Background
  bgBlob: { position: 'absolute', borderRadius: 999, opacity: 0.3, zIndex: 0 },
  blob1: { width: 300, height: 300, backgroundColor: '#E8F5E9', top: -50, right: -100 },
  blob2: { width: 400, height: 400, backgroundColor: '#FFF3E0', bottom: 100, left: -150 },

  keyboardView: { flex: 1, zIndex: 1 },
  scrollContent: { padding: 16, paddingBottom: 60, flexGrow: 1 },

  // Premium Header
  premiumHeader: {
    backgroundColor: '#3E2723', // Deep premium brown
    borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center',
    marginBottom: 16, shadowColor: '#3E2723', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  iconContainer: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: { flex: 1 },
  mainTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 0.5, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif', marginBottom: 2 },
  subTitle: { fontSize: 13, color: '#D7CCC8', fontWeight: '500' },

  // Hero Card
  heroCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  heroTextContainer: { marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#1B5E20', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#444', lineHeight: 22, fontWeight: '500' },
  
  emailButton: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  emailButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14, marginLeft: 8, letterSpacing: 0.5 },

  // Form Card
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)',
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8, marginLeft: 4 },
  required: { color: '#E53935' },
  
  input: {
    backgroundColor: '#F8FDF5',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#333',
    fontWeight: '500'
  },
  
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FDF5',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 10 },
  inputField: { flex: 1, paddingVertical: 16, fontSize: 15, color: '#333', fontWeight: '500' },
  
  messageInput: { height: 120, paddingTop: 16 },
  
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#1B5E20',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: { backgroundColor: '#A5D6A7', shadowOpacity: 0, elevation: 0 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});