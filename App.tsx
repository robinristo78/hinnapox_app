import React from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <>
      <StatusBar style="auto" animated />
      <ScreenContent title="Avaleht" path="App.tsx"></ScreenContent>
    </>
  );
}
