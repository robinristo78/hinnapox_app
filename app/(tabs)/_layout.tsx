import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import NavBar from 'components/NavBar';
import Header from 'components/Header';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LayoutWrapper from 'components/LayoutWrapper';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <>
        <Header />
        <LayoutWrapper>
          <Slot />
        </LayoutWrapper>
        <NavBar />
      </>
    </View>
  );
}
