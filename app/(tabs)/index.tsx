import React from 'react';
import { View, Text } from 'react-native';
import PriceCard from 'components/PriceCard';

const App = () => {
  return (
    <View className="flex-1 items-center bg-white p-4">
      {/* <View className="rounded-lg bg-white p-4 shadow-md">
        <View className="mb-4">
          <Text className="text-2xl font-bold">Tere tulemast Hinnapõhja!</Text>
          <Text className="text-gray-600">Siin näed kütuse ja elektri hindu.</Text>
        </View>
        Siia saab lisada rohkem komponente nagu PriceCard jms
      </View>
      */}
      <PriceCard fuel="D" />
    </View>
  );
};

export default App;
