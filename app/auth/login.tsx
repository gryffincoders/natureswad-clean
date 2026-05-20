import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 1.5; // Make image wider than screen to allow panning

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Background Animation Setup
  const translateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateAnim, {
          toValue: -(IMAGE_WIDTH - width), // Pan left
          duration: 30000, // 30 seconds for a very slow, relaxing breeze effect
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0, // Pan back right
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      router.replace('/(tabs)/home'); 
    } catch (error: any) {
      let msg = 'Something went wrong.';
      if (error.code === 'auth/invalid-email') msg = 'That email address is invalid!';
      if (error.code === 'auth/user-not-found') msg = 'No user found with this email.';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Moving Background Image - Bright, vibrant fresh green leaves */}
      <Animated.Image
        source={{ uri: 'https://images.unsplash.com/photo-1533038590840-1cbea6e15ea2?q=80&w=1080&auto=format&fit=crop' }} 
        style={[
          styles.backgroundImage,
          { transform: [{ translateX: translateAnim }] }
        ]}
      />
      {/* Light, fresh overlay instead of black! */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Area */}
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Natureswad</Text>
            <Text style={styles.tagline}>Welcome Back, Nature Lover! 🌿</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="hello@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#A5D6A7"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#A5D6A7"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#81C784" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E8F5E9' }, // Light green fallback instead of black
  backgroundImage: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: IMAGE_WIDTH,
    height: height,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Bright frosted glass effect
  },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  
  header: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
  mainTitle: { fontSize: 40, fontWeight: '900', color: '#1B5E20', letterSpacing: 1, marginBottom: 8 }, // Dark green text instead of white
  tagline: { fontSize: 16, color: '#2E7D32', fontWeight: '700' },

  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Brighter, more transparent glass
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  
  label: { fontSize: 14, color: '#2E7D32', fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9', // Very light green background for inputs
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#1A1A1A', fontWeight: '500' },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#4CAF50', fontSize: 14, fontWeight: '700' },

  primaryBtn: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },

  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#555', fontSize: 15, fontWeight: '500' },
  linkText: { color: '#2E7D32', fontSize: 15, fontWeight: '800' },
});