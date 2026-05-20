import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 1.5;

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
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
          toValue: -(IMAGE_WIDTH - width),
          duration: 30000, 
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      
      if (userCredential.user) {
        await userCredential.user.updateProfile({ displayName: name });
      }

      Alert.alert('Success', 'Account created successfully! 🌱', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
      ]);

    } catch (error: any) {
      let msg = error.message || 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') msg = 'That email address is already in use!';
      if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      Alert.alert('Registration Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Moving Background Image - Light, airy nature background */}
      <Animated.Image
        source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1080&auto=format&fit=crop' }} 
        style={[
          styles.backgroundImage,
          { transform: [{ translateX: translateAnim }] }
        ]}
      />
      {/* Light, fresh overlay instead of black */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1B5E20" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Join Natureswad</Text>
            <Text style={styles.subtitle}>Start your healthy journey today! 🌾</Text>
          </View>

          <View style={styles.formContainer}>
            
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Your Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#A5D6A7"
              />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="hello@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#A5D6A7"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
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

            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={handleSignUp} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E8F5E9' },
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
    backgroundColor: 'rgba(255, 255, 255, 0.55)', // Bright overlay
  },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20, paddingTop: 60 },
  
  backBtn: { 
    marginBottom: 20, width: 44, height: 44, 
    justifyContent: 'center', alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    borderRadius: 22, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 
  },
  
  header: { marginBottom: 30 },
  title: { fontSize: 36, fontWeight: '900', color: '#1B5E20' }, // Dark green text
  subtitle: { fontSize: 16, color: '#2E7D32', marginTop: 6, fontWeight: '600' },
  
  formContainer: { 
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    borderRadius: 24, padding: 24, 
    shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  
  label: { fontSize: 14, color: '#2E7D32', fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  
  inputBox: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F1F8E9', borderRadius: 14, 
    paddingHorizontal: 14, height: 54, marginBottom: 20, 
    borderWidth: 1, borderColor: '#C8E6C9' 
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#1A1A1A', fontWeight: '500' },
  
  primaryBtn: { backgroundColor: '#2E7D32', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#555', fontSize: 15, fontWeight: '500' },
  linkText: { color: '#2E7D32', fontSize: 15, fontWeight: '800' },
});