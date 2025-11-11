import React from 'react';
import { Slot } from 'expo-router';
import NavBar from 'components/NavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from 'components/Header';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Header />
      <Slot />
      <NavBar />
    </SafeAreaView>
  );
}
