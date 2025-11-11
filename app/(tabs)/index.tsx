import React from 'react';
import { View, Text } from 'react-native';

const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <View className="rounded-lg bg-white p-4 shadow-md">
        <View className="mb-4">
          <Text className="text-2xl font-bold">Tere tulemast Hinnapõhja!</Text>
          <Text className="text-gray-600">Siin näed kütuse ja elektri hindu.</Text>
        </View>
        {/* Siia saab lisada rohkem komponente nagu PriceCard jms */}
      </View>
    </View>
  );
};

export default App;
