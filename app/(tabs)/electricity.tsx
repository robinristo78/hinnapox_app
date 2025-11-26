import React from 'react';
import PriceCard from '../../components/PriceCard';
import ElectricityChart from '../../components/ElectricityChart';
export default function ElectricityScreen() {
  return (
    <>
      <PriceCard fuel="EL" />

      <ElectricityChart />
    </>
  );
}
