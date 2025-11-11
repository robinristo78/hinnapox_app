import React from 'react';
import { View, Text } from 'react-native';

const FuelColorsMap: Record<string, string> = {
  '95': 'bg-green-400 text-black',
  '98': 'bg-green-400 text-black',
  D: 'bg-black text-white',
  EL: 'bg-blue-300 text-white',
};

const FuelMap: Record<string, string> = {
  '95': 'Bensiin 95',
  '98': 'Bensiin 98',
  D: 'Diisel',
  EL: 'Elekter',
};

const PriceCard = () => {
  const [fuelType] = React.useState('95');
  const [price] = React.useState(19.99);

  return (
    <View className={styles.container}>
      <View className="mb-4 flex-col">
        <Text className="text-xl font-bold">{FuelMap[fuelType]}</Text>
        <Text className="my-2 text-4xl font-bold">
          {price} {fuelType === 'EL' ? '€/MWh' : '€/L'}
        </Text>
        <Text className="text-md text-gray-600">Hetkehind</Text>
      </View>
      <View className={`flex-col justify-center rounded-lg ${FuelColorsMap[fuelType]} px-4 py-2`}>
        <Text className="m-0 text-5xl font-bold">{fuelType}</Text>
      </View>
    </View>
  );
};

const styles = {
  container:
    'flex-row justify-between items-center p-2 px-4 bg-white rounded-2xl shadow-md w-[90%]',
};

export default PriceCard;
