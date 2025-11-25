import React from 'react';
import PriceCard from 'components/PriceCard';

const App = () => {
  return (
    <>
      <PriceCard fuel="95" />
      <PriceCard fuel="98" />
      <PriceCard fuel="D" />
      <PriceCard fuel="EL" />
    </>
  );
};

export default App;
