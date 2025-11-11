import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import NavBar from 'components/NavBar';
import Header from 'components/Header';
import Splash from './splash'; // Import your Splash component
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // 5000 ms = 5 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {showSplash ? (
        <Splash /> // Show splash screen
      ) : (
        <>
          <Header />
          <Slot /> {/* Your main app content */}
          <NavBar />
        </>
      )}
    </View>
  );
}
