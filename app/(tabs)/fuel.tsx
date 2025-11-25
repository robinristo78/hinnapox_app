import React from 'react';
import PriceCard from 'components/PriceCard';

const Fuel = () => {
  return (
    <>
      <PriceCard fuel="95" />
      <PriceCard fuel="98" />
      <PriceCard fuel="D" />
      {/* Siia tuleb Chart/Diagram */}
    </>
  );
};

export default Fuel;
