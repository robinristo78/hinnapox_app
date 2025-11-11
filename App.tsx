import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import NavBar from 'components/NavBar'

import './global.css';

export default function App() {
  return (
    <View className='flex-1 bg-white'>
      <ScreenContent title="Home" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" animated />
      <NavBar />
    </View>
  );
}
