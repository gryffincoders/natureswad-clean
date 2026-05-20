// app/_layout.tsx
import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';
import { WishlistProvider } from '../src/context/wishlistContext';
import { NavigationHistoryProvider } from './navigation/NavigationHistoryProvider';

export default function RootLayout() {
  return (
    <NavigationHistoryProvider>
      <CartProvider>
        <WishlistProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="components/wishlist" />
            <Stack.Screen name="components/ShoppingBag" />
            <Stack.Screen name="components/CheckoutScreen" />
            <Stack.Screen name="components/MyOrders" />
            {/* ✅ Added the new Nutritional Guide screen */}
            <Stack.Screen name="components/NutritionalGuide" />
            <Stack.Screen name="components/Shipping" />
            <Stack.Screen name="components/Compliance" />
          </Stack>
        </WishlistProvider>
      </CartProvider>
    </NavigationHistoryProvider>
  );
}