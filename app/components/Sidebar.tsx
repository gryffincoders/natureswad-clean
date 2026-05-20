import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableWithoutFeedback, 
  SafeAreaView, TouchableOpacity, Animated, Image, Dimensions, ScrollView, Alert 
} from 'react-native';
import { useRouter, usePathname } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.82; 

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);
    return subscriber; 
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleNavigation = (route: string) => {
    onClose(); 
    setTimeout(() => { if (route) router.push(route as any); }, 300); 
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      onClose();
      router.replace('/auth/login');
    } catch (error) { console.error('Logout failed', error); }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              if (user) {
                await user.delete();
                onClose();
                router.replace('/auth/login');
              }
            } catch (error: any) {
              console.error('Account deletion failed', error);
              // Firebase security rule: sensitive actions require recent authentication
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  "Session Expired", 
                  "For security reasons, please log out and log back in before deleting your account."
                );
              } else {
                Alert.alert("Error", "Failed to delete account. Please try again later.");
              }
            }
          }
        }
      ]
    );
  };

  const isActive = (route: string) => pathname.includes(route);

  // ✅ ADDED REWARDS ROUTE HERE
  const menuItems = [
    { id: 1, title: 'Home', route: '/(tabs)/home', icon: 'home-outline', activeIcon: 'home' },
    { id: 2, title: 'Store', route: '/(tabs)/products', icon: 'bag-handle-outline', activeIcon: 'bag-handle' },
    { id: 3, title: 'My Orders', route: '/components/MyOrders', icon: 'bag-outline', activeIcon: 'bag' },
    { id: 13, title: 'Rewards', route: '/components/Rewards', icon: 'star-outline', activeIcon: 'star' },
    { id: 4, title: 'Nutritional Guide', route: '/components/NutritionalGuide', icon: 'leaf-outline', activeIcon: 'leaf' },
    { id: 5, title: 'Our Story', route: '/(tabs)/testimonials', icon: 'book-outline', activeIcon: 'book' },
    { id: 6, title: 'Shopping Bag', route: '/components/ShoppingBag', icon: 'cart-outline', activeIcon: 'cart' },
    { id: 7, title: 'Get In Touch', route: '/components/ContactUs', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
    { id: 8, title: 'Terms & Conditions', route: '/components/terms', icon: 'document-text-outline', activeIcon: 'document-text' },
    { id: 9, title: 'Privacy Policy', route: '/components/privacy', icon: 'shield-checkmark-outline', activeIcon: 'shield-checkmark' },
    { id: 10, title: 'Refund Policy', route: '/components/refund', icon: 'refresh-circle-outline', activeIcon: 'refresh-circle' },
    { id: 11, title: 'Shipping Policy', route: '/components/Shipping', icon: 'bus-outline', activeIcon: 'bus' },
    { id: 12, title: 'Compliance', route: '/components/Compliance', icon: 'shield-checkmark-outline', activeIcon: 'shield-checkmark' },
  ];

  if (!visible) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose} animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={onClose}><View style={styles.overlayTouchable} /></TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.header}>
              <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#1B5E20" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View>
                <TouchableOpacity style={styles.userCard} onPress={() => !user && handleNavigation('/auth/login')} activeOpacity={user ? 1 : 0.8}>
                  <View style={styles.avatarContainer}><Ionicons name="person" size={24} color="#1B5E20" /></View>
                  <View style={styles.userInfo}>
                    {user ? (
                      <>
                        <Text style={styles.welcomeText}>Hello, {user.displayName ? user.displayName.split(' ')[0] : 'Lover'}! 🌿</Text>
                        <Text style={styles.subWelcomeText}>{user.email}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.welcomeText}>Login / Sign Up</Text>
                        <Text style={styles.subWelcomeText}>Tap to join the community</Text>
                      </>
                    )}
                  </View>
                  {!user && <Ionicons name="chevron-forward" size={20} color="#FFF" />}
                </TouchableOpacity>

                <View style={styles.menuContainer}>
                  {menuItems.map((item) => {
                    const active = isActive(item.route);
                    return (
                      <TouchableOpacity key={item.id} onPress={() => handleNavigation(item.route)} style={[styles.menuItem, active && styles.menuItemActive]} activeOpacity={0.7}>
                        <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                          <Ionicons name={(active ? item.activeIcon : item.icon) as any} size={20} color={active ? "#1B5E20" : "#555"} />
                        </View>
                        <Text style={[styles.menuText, active && styles.menuTextActive]}>{item.title}</Text>
                        {active && <View style={styles.activeIndicator} />}
                      </TouchableOpacity>
                    );
                  })}

                  {user && (
                    <>
                      {/* Logout Button */}
                      <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.logoutItem]} activeOpacity={0.7}>
                        <View style={[styles.iconBox, styles.logoutIconBox]}><Ionicons name="log-out-outline" size={20} color="#E53935" /></View>
                        <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                      </TouchableOpacity>

                      {/* Delete Account Button */}
                      <TouchableOpacity onPress={handleDeleteAccount} style={[styles.menuItem, styles.deleteItem]} activeOpacity={0.7}>
                        <View style={[styles.iconBox, styles.deleteIconBox]}><Ionicons name="trash-outline" size={20} color="#B71C1C" /></View>
                        <Text style={[styles.menuText, styles.deleteText]}>Delete Account</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.copyrightText}>V 1.0.0 • Natureswad © 2026</Text>
              </View>
            </ScrollView>

          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, flexDirection: 'row' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 },
  overlayTouchable: { flex: 1 },
  
  sidebar: { width: SIDEBAR_WIDTH, position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: '#FFFFFF', borderTopRightRadius: 32, borderBottomRightRadius: 32, zIndex: 2, shadowColor: "#000", shadowOffset: { width: 10, height: 0 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 15, overflow: 'hidden' },
  safeArea: { flex: 1 },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20, 
    backgroundColor: '#F1F8E9', 
    borderBottomWidth: 1, borderBottomColor: '#C8E6C9' 
  },
  logo: { width: 200, height: 100 }, 
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },

  scrollContainer: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 80, flexGrow: 1 },

  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B5E20', padding: 20, borderRadius: 24, marginBottom: 32, shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userInfo: { flex: 1 },
  welcomeText: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  subWelcomeText: { fontSize: 13, color: '#A5D6A7', fontWeight: '500' },

  menuContainer: { gap: 6 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 },
  menuItemActive: { backgroundColor: '#F1F8E9' },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  iconBoxActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuText: { fontSize: 16, color: '#444', fontWeight: '600', flex: 1 },
  menuTextActive: { color: '#1B5E20', fontWeight: '800' },
  activeIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D32' },

  logoutItem: { marginTop: 24, borderTopWidth: 1, borderTopColor: '#F0F4F8', paddingTop: 24, borderRadius: 0 },
  logoutIconBox: { backgroundColor: '#FFEBEE' },
  logoutText: { color: '#D32F2F' },

  deleteItem: { marginTop: 4, borderRadius: 0 },
  deleteIconBox: { backgroundColor: '#FFCDD2' },
  deleteText: { color: '#B71C1C', fontWeight: '700' },

  footer: { marginTop: 'auto', paddingTop: 40, alignItems: 'center' },
  copyrightText: { fontSize: 12, color: '#999', fontWeight: '600', letterSpacing: 0.5 },
});