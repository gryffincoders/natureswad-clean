import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
// ✅ IMPORT LINEAR GRADIENT FOR A MODERN PREMIUM LOOK
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Index = () => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(25);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // 1. Start Smooth Micro-Animations
      opacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.back(1.5)) });
      translateY.value = withTiming(0, { duration: 1200, easing: Easing.out(Easing.quad) });

      // 2. Navigate to Home after 3.5 seconds
      const timeout = setTimeout(() => {
        router.replace('/(tabs)/home'); 
      }, 3500);

      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded]); 

  // Modern Combined Animation Style
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.fallbackContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  return (
    // ✅ SWAPPED WHITE BG WITH A SOFT ECO-WELLNESS GRADIENT
    <LinearGradient
      colors={['#F4F9F4', '#E8F5E9', '#FFFFFF']}
      style={styles.container}
    >
      {/* MODERN BACKGROUND ABSTRACT ELEMENTS */}
      <View style={[styles.bgBlob, styles.blobTop]} />
      <View style={[styles.bgBlob, styles.blobBottom]} />

      <View style={styles.centerContent}>
        {/* LOGO HERO CONTAINER */}
        <Animated.View style={[styles.logoWrapper, animatedLogoStyle]}>
          <Animated.Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
       
        {/* MINIMALIST PREMIUM SPINNER */}
        <ActivityIndicator size="small" color="#2E7D32" style={styles.spinner} />
      </View>

      {/* FOOTER BRANDING FOR AN AUTHENTIC NUTRITION PLATFORM APP LOOK */}
      <Animated.View style={[styles.footerContainer, { opacity: opacity }]}>
        <Text style={styles.footerTagline}>100% PURE & NATURAL</Text>
        <Text style={styles.footerSubtext}>Nurturing Wellness, Naturally</Text>
      </Animated.View>
    </LinearGradient>
  );
};

export default Index;

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F9F4',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 5,
  },
  logoWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 20,
    // Soft drop shadow to elevate the branding container
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
  spinner: {
    marginTop: 40,
    transform: [{ scale: 1.2 }],
  },
  // MODERN DECORATIVE GRAPHICS
  bgBlob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(46, 125, 50, 0.04)',
  },
  blobTop: {
    width: width * 0.8,
    height: width * 0.8,
    top: -height * 0.1,
    left: -width * 0.2,
  },
  blobBottom: {
    width: width,
    height: width,
    bottom: -height * 0.15,
    right: -width * 0.2,
  },
  // BRAND FOOTER
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  footerTagline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 2,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#757575',
    fontFamily: 'Poppins_400Regular',
  },
});
