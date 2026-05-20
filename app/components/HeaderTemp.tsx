import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Location from 'expo-location'; 
import { useNavigationHistory } from '../navigation/NavigationHistoryProvider';
import Sidebar from './Sidebar';

// --- SESSION CACHE (Persists across screen switches until app closes) ---
let cachedLocationInfo: { title: string; subtitle: string } | null = null;
let isFetchingInProgress = false;

interface HeaderProps {
  showBack?: boolean;
}

export default function HeaderTemp({ showBack }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { history, goBack } = useNavigationHistory();

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Initialize state with cache if available
  const [locationTitle, setLocationTitle] = useState(cachedLocationInfo?.title || 'Fetching Location...');
  const [locationSubtitle, setLocationSubtitle] = useState(cachedLocationInfo?.subtitle || 'Please wait...');

  const menuScale = useRef(new Animated.Value(1)).current;
  const backScale = useRef(new Animated.Value(1)).current;

  const logoSource = require('../../assets/icon.png');

  /* ------------------ PAGE DETECTION ------------------ */
  const isHome =
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '/home' || 
    pathname === '/(tabs)/home';

  const shouldShowBack =
    showBack !== undefined
      ? showBack
      : history.length > 1 || router.canGoBack();

  /* ------------------ LOCATION FETCHING ------------------ */

  const fetchLocation = async (forceRefresh = false) => {
    // 1. If we already have the location and aren't forcing a refresh, use the cache and stop.
    if (!forceRefresh && cachedLocationInfo) {
      setLocationTitle(cachedLocationInfo.title);
      setLocationSubtitle(cachedLocationInfo.subtitle);
      return;
    }

    // 2. Prevent overlapping fetch requests
    if (isFetchingInProgress) return;
    
    isFetchingInProgress = true;
    setLocationTitle('Locating...');
    setLocationSubtitle('Fetching your address...');

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationTitle('Location Denied');
        setLocationSubtitle('Tap here to enable location permissions.');
        isFetchingInProgress = false;
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const place = geocode[0];
        
        const mainName = place.name || place.street || place.district || 'Current Location';
        const fullAddress = [place.street, place.subregion, place.district, place.city, place.region]
          .filter(Boolean)
          .join(', ');

        // Save to global cache
        cachedLocationInfo = { title: mainName, subtitle: fullAddress || 'Address details not found' };
        
        setLocationTitle(cachedLocationInfo.title);
        setLocationSubtitle(cachedLocationInfo.subtitle);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationTitle('Location Error');
      setLocationSubtitle('Tap here to try again.');
    } finally {
      isFetchingInProgress = false;
    }
  };

  useEffect(() => {
    if (isHome) {
      fetchLocation(false); // Do not force refresh on normal mount
    }
  }, [isHome]);

  /* ------------------ HANDLERS ------------------ */

  const handleBackPress = () => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.9, duration: 90, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start();

    if (history.length > 1) {
      goBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleMenuPress = () => {
    Animated.sequence([
      Animated.timing(menuScale, { toValue: 0.9, duration: 90, useNativeDriver: true }),
      Animated.timing(menuScale, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start(() => setSidebarVisible(true));
  };

  /* ------------------ RENDER ------------------ */

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          <View style={styles.leftAlignedGroup}>
            <Animated.View style={{ transform: [{ scale: menuScale }] }}>
              <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton} activeOpacity={0.7}>
                <Ionicons name="menu" size={28} color="#1B5E20" />
              </TouchableOpacity>
            </Animated.View>

            {isHome ? (
              <TouchableOpacity 
                style={styles.locationContainer} 
                activeOpacity={0.6} 
                onPress={() => fetchLocation(true)} // Pass true to force refresh on manual tap
              >
                <View style={styles.locationTitleRow}>
                  <Ionicons name="navigate" size={22} color="#F25D23" style={styles.locationIcon} />
                  <Text style={styles.locationTitle} numberOfLines={1}>{locationTitle}</Text>
                  <Ionicons name="chevron-down" size={18} color="#2E7D32" style={styles.chevronIcon} />
                </View>
                <Text style={styles.locationSubtitle} numberOfLines={1}>{locationSubtitle}</Text>
              </TouchableOpacity>

            ) : shouldShowBack ? (
              <Animated.View style={[styles.backContainer, { transform: [{ scale: backScale }] }]}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
                  <Ionicons name="arrow-back" size={24} color="#1B5E20" />
                </TouchableOpacity>
              </Animated.View>
            ) : null}

          </View>

         {!isHome && (
            <View style={styles.absoluteCenter}>
              <Image source={logoSource} style={styles.logo} resizeMode="contain" />
            </View>
          )}

        </View>
      </SafeAreaView>

      <Sidebar
        visible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F1F8E9', // Soft, realistic botanical green
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    elevation: 4,
    shadowColor: '#1B5E20', // Tinted shadow for nature vibe
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    zIndex: 10,
  },
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F1F8E9', // Matches safe area
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9', // Soft leafy border line
  },
  leftAlignedGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF', // Clean white pops off the green
    borderWidth: 1,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    transform: [{ rotate: '45deg' }, { translateY: -2 }], 
    marginRight: 6,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B5E20', // Dark forest green
    flexShrink: 1,
    letterSpacing: -0.5,
  },
  chevronIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
  locationSubtitle: {
    fontSize: 13,
    color: '#2E7D32', // Muted dark green instead of grey
    paddingLeft: 28,
    marginTop: 2,
  },
  backContainer: {
    marginLeft: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF', // Clean white pops off the green
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  absoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  logo: {
    width: 140,
    height: 55,
  },
});