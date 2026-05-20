import React, { useEffect } from 'react';
import { Tabs, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ----------------------------------------------------
//  FIREBASE IMPORTS & INITIALIZATION
// ----------------------------------------------------
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics'; 

// UPDATED CONFIGURATION FROM YOUR google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyCzIC3BGN7z9nuyVrDaxjpNrJlL08CDFb8",
  projectId: "natureswad-83a35",
  storageBucket: "natureswad-83a35.firebasestorage.app",
  appId: "1:707227434311:android:acd37bf6b0d49773352062",
  messagingSenderId: "707227434311", // This is the project_number from your file
};

// Check if Firebase is already initialized to avoid duplicate app errors
if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log(" Firebase initialized successfully with new config");
  } catch (error) {
    console.error(" Firebase Initialization Error:", error);
  }
}

export default function TabLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // ----------------------------------------------------
  //  SCREEN TRACKING EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    // Only track on native devices (iOS/Android), avoiding web if necessary
    if (Platform.OS !== 'web' && pathname) {
      let screenName = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      if (!screenName || screenName === '') screenName = 'Home';
      if (screenName === 'products') screenName = 'Offerings';
      if (screenName === 'testimonials') screenName = 'Stories';
      if (screenName === 'bot') screenName = 'Sage Assistant'; //  Added tracking for Sage

      // console.log(`🔥 Tracking Screen: ${screenName}`);

      try {
        analytics().logEvent('screen_view', {
          screen_name: screenName,
          screen_class: screenName,
        });
        // console.log(` Firebase: Logged screen view → ${screenName}`);
      } catch (error) {
        console.error(' Firebase Analytics error:', error);
      }
    }
  }, [pathname]);

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#33691E',
      headerShown: false, 
      tabBarStyle: {
        // Dynamic height calculation for modern phones (Safe Area)
        height: 60 + insets.bottom, 
        paddingBottom: insets.bottom + 5, 
        backgroundColor: '#fff',
        borderTopColor: '#f0f0f0',
        elevation: 10, 
      }
    }}>
      {/* Tab 1: Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* Tab 2: Offerings */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'Offerings',
          tabBarIcon: ({ color }) => <Ionicons name="pricetags" size={24} color={color} />,
        }}
      />

      {/* Tab 3: Sage (Bot) */}
      <Tabs.Screen
        name="bot"
        options={{
          title: 'Sage',
          tabBarIcon: ({ color }) => <Ionicons name="leaf" size={24} color={color} />,
        }}
      />

      {/* Tab 4: Stories */}
      <Tabs.Screen
        name="testimonials"
        options={{
          title: 'Stories',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}