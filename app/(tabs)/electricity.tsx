import React from 'react';
import { ScrollView } from 'react-native';
import PriceCard from '../../components/PriceCard';
import ElectricityChart from '../../components/ElectricityChart';
export default function ElectricityScreen() {
  return (
    <ScrollView>
      <PriceCard fuel="EL" />

      <ElectricityChart />
    </ScrollView>
  );
}
