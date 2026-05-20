// app/navigation/NavigationHistoryProvider.tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'expo-router';

type NavigationHistoryContextType = {
  goBack: () => void;
  addToHistory: (path: string) => void;
  clearHistory: () => void;
  history: string[]; // Exposed for debugging if needed
};

const NavigationHistoryContext = createContext<NavigationHistoryContextType | null>(null);

export const NavigationHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Store history without triggering rerenders automatically
  const historyRef = useRef<string[]>([]);

  // ⭐ Force rerender when history updates so UI stays in sync
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Track path changes
  useEffect(() => {
    const history = historyRef.current;
    
    // Normalize path to handle nuances
    const currentPath = pathname;

    // 1. Reset history if we are on the Home Tab
    if (currentPath === '/home' || currentPath === '/(tabs)/home' || currentPath === '/') {
      historyRef.current = ['/(tabs)/home'];
      forceUpdate();
      return;
    }

    // 2. Add new path if it's different from the last one
    // We avoid adding duplicates if the user is just refreshing or weird route glitches
    if (history[history.length - 1] !== currentPath) {
      history.push(currentPath);
      forceUpdate();
    }
    
    // Optional: Log for debugging
    // console.log("Current History Stack:", historyRef.current);

  }, [pathname]);

  const goBack = () => {
    const history = historyRef.current;

    if (history.length > 1) {
      // Remove current page
      history.pop(); 
      // Get previous page
      const previous = history[history.length - 1];
      
      // Navigate to it
      router.push(previous as any);
    } else {
      // Fallback: If stack is empty, go Home
      router.push('/(tabs)/home');
      historyRef.current = ['/(tabs)/home'];
    }

    forceUpdate();
  };

  const addToHistory = (path: string) => {
    const history = historyRef.current;
    if (history[history.length - 1] !== path) {
      history.push(path);
      forceUpdate();
    }
  };

  const clearHistory = () => {
    historyRef.current = ['/(tabs)/home'];
    forceUpdate();
  };

  return (
    <NavigationHistoryContext.Provider value={{ goBack, addToHistory, clearHistory, history: historyRef.current }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = () => {
  const context = useContext(NavigationHistoryContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  return context;
};
