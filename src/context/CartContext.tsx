// src/context/CartContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -------- TYPES --------
export type CartItem = {
  id: string;
  name: string;
  price: string;        // e.g. "₹999"
  image: any;
  quantity: number;
  weight: string;       // e.g. "500g"
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, quantity: number) => void;
  clearCart: () => void; // Added so you can empty the cart after successful checkout
  cartTotal: number;
};

// ✅ Provide a REAL default value (Fabric-safe)
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
});

// -------- PROVIDER --------
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LOAD FROM STORAGE ON MOUNT ---
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@Natureswad_Cart');
        if (savedData) {
          setCartItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load cart", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // --- 2. SAVE TO STORAGE ON CHANGE ---
  useEffect(() => {
    if (isLoaded) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem('@Natureswad_Cart', JSON.stringify(cartItems));
        } catch (error) {
          console.error("Failed to save cart", error);
        }
      };
      saveCart();
    }
  }, [cartItems, isLoaded]);

  // Safely parse price (₹999 → 999)
  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    return Number(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.id === newItem.id && item.weight === newItem.weight
      );

      if (existing) {
        return prev.map(item =>
          item.id === newItem.id && item.weight === newItem.weight
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string, itemWeight: string) => {
    setCartItems(prev =>
      prev.filter(
        item => !(item.id === itemId && item.weight === itemWeight)
      )
    );
  };

  const updateQuantity = (
    itemId: string,
    itemWeight: string,
    newQty: number
  ) => {
    if (newQty < 1) return;

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId && item.weight === itemWeight
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + parsePrice(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// -------- HOOK --------
export function useCart(): CartContextType {
  return useContext(CartContext);
}