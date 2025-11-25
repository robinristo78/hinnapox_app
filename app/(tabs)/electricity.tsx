import React from 'react';
import { View, Text } from 'react-native';
import PriceCard from 'components/PriceCard';

const Electricity = () => {
  const currentHour = new Date().getHours() + ':00';

  return (
    <View className="flex-1 items-center bg-white p-4">
      <View className="mb-4 w-[50%] flex-col items-center justify-center rounded">
        <View className="mb-2 rounded-lg border-2 border-black/10 bg-gray-500 p-3">
          <Text className="text-wrap text-center font-semibold text-black">{currentHour}</Text>
        </View>

        <View className="rounded-full bg-blue-100 p-3">
          <Text className="text-wrap text-center font-semibold text-blue-800">
            Hinnad on ligikaudsed ja võivad erineda tegelikest hindadest
          </Text>
        </View>
      </View>

      <PriceCard fuel="EL" />
    </View>
  );
};

export default Electricity;
