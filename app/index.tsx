import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';

const Index = () => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // 1. Start Logo Animation
      opacity.value = withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) });
      translateY.value = withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) });

      // 2. Navigate to Home after 3 seconds
      const timeout = setTimeout(() => {
        // ensuring lowercase 'home' to match the filename exactly
        router.replace('/(tabs)/home'); 
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded]); 

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Fallback if fonts aren't loaded yet
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        {/* Changed spinner color to Dark Green to contrast with White */}
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/icon.png')} // Make sure this path is correct!
        style={[styles.logo, animatedLogoStyle]}
        resizeMode="contain"
      />
     
      {/* Changed spinner color to Dark Green to contrast with White */}
      <ActivityIndicator size="large" color="#1B5E20" style={{ marginTop: 20 }} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // Set background to pure white
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
});