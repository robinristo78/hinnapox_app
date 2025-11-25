import React from 'react';
import { View } from 'react-native';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <View className="flex-1 items-center bg-white">{children}</View>;
};

export default LayoutWrapper;
