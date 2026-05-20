// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WishlistItem = {
  id: string;
  name: string;
  price: string;
  image: any;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  toggleWishlistItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents overwriting on initial load

  // --- 1. LOAD FROM STORAGE ON MOUNT ---
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@Natureswad_Wishlist');
        if (savedData) {
          setWishlistItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWishlist();
  }, []);

  // --- 2. SAVE TO STORAGE ON CHANGE ---
  useEffect(() => {
    if (isLoaded) {
      const saveWishlist = async () => {
        try {
          await AsyncStorage.setItem('@Natureswad_Wishlist', JSON.stringify(wishlistItems));
        } catch (error) {
          console.error("Failed to save wishlist", error);
        }
      };
      saveWishlist();
    }
  }, [wishlistItems, isLoaded]);

  const toggleWishlistItem = (item: WishlistItem) => {
    setWishlistItems(prev => {
      const exists = prev.find(wishlistItem => wishlistItem.id === item.id);
      
      if (exists) {
        // Remove from wishlist
        return prev.filter(wishlistItem => wishlistItem.id !== item.id);
      } else {
        // Add to wishlist
        return [...prev, item];
      }
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        toggleWishlistItem, 
        isInWishlist, 
        clearWishlist,
        getWishlistCount 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}