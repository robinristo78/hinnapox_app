import React from 'react';
import { View, Text } from 'react-native';
import PriceCard from 'components/PriceCard';

const App = () => {
  return (
    <View className="flex-1 items-center bg-white p-4">
      <PriceCard fuel="95" />
      <PriceCard fuel="98" />
      <PriceCard fuel="D" />
      <PriceCard fuel="EL" />
    </View>
  );
};

export default App;
