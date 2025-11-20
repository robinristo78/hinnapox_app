import React from 'react';
import { View, Text } from 'react-native';

export type FuelType = "95" | "98" | "D" | "EL";

interface PriceCardProps {
  fuel: FuelType;
}

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

const PriceCard = ({ fuel }: PriceCardProps) => {
  const [fuelType] = React.useState(fuel);
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
        <Text className={`m-0 text-5xl font-bold ${FuelColorsMap[fuelType]}`}>{fuelType}</Text>
      </View>
    </View>
  );
};

const styles = {
  container:
    'flex-row justify-between items-center p-2 px-4 bg-white rounded-2xl shadow-md w-[90%] mt-5',
};

export default PriceCard;
