import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useFuelPrice } from 'hooks/useFuelPrice';

export type FuelType = '95' | '98' | 'D' | 'EL';

interface PriceCardProps {
  fuel: FuelType;
}

const FuelColorsMap: Record<string, { textStyle: string; bgStyle: string }> = {
  '95': { textStyle: 'text-black', bgStyle: 'bg-green-400' },
  '98': { textStyle: 'text-black', bgStyle: 'bg-green-400' },
  D: { textStyle: 'text-white', bgStyle: 'bg-black' },
  EL: { textStyle: 'text-white', bgStyle: 'bg-blue-300' },
};

const FuelMap: Record<string, string> = {
  '95': 'Bensiin 95',
  '98': 'Bensiin 98',
  D: 'Diisel',
  EL: 'Elekter',
};

const PriceCard = ({ fuel }: PriceCardProps) => {
  const [fuelType] = useState(fuel);
  const { data: price = fuelType === 'EL' ? 80.0 : 1.4 } = useFuelPrice(fuelType);
  const fuelTypeTextStyle = FuelColorsMap[fuelType]?.textStyle || 'text-black';
  const fuelTypeBgStyle = FuelColorsMap[fuelType]?.bgStyle || 'bg-gray-200';

  const lastPriceRef = useRef<number>(price);
  useEffect(() => {
    if (lastPriceRef.current !== price) {
      lastPriceRef.current = price;
      console.log(`Price for ${fuelType} changed to ${price}`);
    }
  }, [price, fuelType]);

  return (
    <View className={styles.container}>
      <View className="my-1 flex-col">
        <Text className="text-xl font-bold">{FuelMap[fuelType]}</Text>
        <View className="my-2 flex-row items-center">
          <Text className="text-4xl font-bold">
            {price} {fuelType === 'EL' ? '€/MWh' : '€/L'}
          </Text>
        </View>
        <Text className="text-md text-gray-600">Hetkehind</Text>
      </View>
      <View
        className={`flex-col justify-center rounded-lg ${fuelTypeBgStyle} min-w-20 items-center px-4 py-2`}>
        <Text className={`m-0  text-5xl font-bold ${fuelTypeTextStyle}`}>{fuelType}</Text>
      </View>
    </View>
  );
};

const styles = {
  container:
    'flex-row justify-between items-center p-2 px-4 border-2 border-black/5 bg-white rounded-2xl shadow-lg w-[90%] mt-6',
};

export default PriceCard;
