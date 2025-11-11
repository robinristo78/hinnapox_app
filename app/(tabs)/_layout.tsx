import React from 'react';
import { Slot } from 'expo-router';
import NavBar from 'components/NavBar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from 'components/Header';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
      <Header />
      <Slot />
      <NavBar />
    </SafeAreaView>
  );
}
