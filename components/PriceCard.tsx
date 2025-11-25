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
  '95': 'Bensiin',
  '98': 'Bensiin',
  D: 'Diisel',
  EL: 'Elekter',
};

const PriceCard = ({ fuel }: PriceCardProps) => {
  const [fuelType] = useState(fuel);
  const { data: priceRaw = fuelType === 'EL' ? 80.0 : 1.4 } = useFuelPrice(fuelType);
  const price = fuelType === 'EL' ? Number((priceRaw / 10).toFixed(2)) : priceRaw; //Kui on elekter (€/MWh), jagame 10-ga, et saada senti/kWh

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
            {price} <Text className="text-2xl">{fuelType === 'EL' ? 's/kWh' : '€/L'}</Text>
          </Text>
        </View>
        <Text className="text-md text-gray-600">Hetkehind</Text>
      </View>
      <View
        className={`flex-col justify-center rounded-lg ${fuelTypeBgStyle} w-[6rem] items-center px-4 py-2`}>
        <Text className={`m-0 text-5xl font-bold ${fuelTypeTextStyle}`}>{fuelType}</Text>
      </View>
    </View>
  );
};

const styles = {
  container:
    'flex-row justify-between items-center p-2 px-4 border-2 border-black/5 bg-white rounded-2xl shadow-lg w-[90%] mt-6',
};

export default PriceCard;
