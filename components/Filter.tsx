import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';


type FilterProps = {
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  allBrands: string[];
};

const Filter: React.FC<FilterProps> = ({ selectedBrands, toggleBrand, allBrands }) => {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#9A8C8C' : '#E0E0E0';


  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,

        paddingVertical: 8,
      }}
      className='bg-white dark:bg-theme-dark-secondary'
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {allBrands.map((brand) => {
          const selected = selectedBrands.includes(brand);
          return (
            <TouchableOpacity
              key={brand}
              onPress={() => toggleBrand(brand)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 14,
                marginRight: 8,
                borderRadius: 20,
                backgroundColor: selected ? '#007AFF' : iconColor,
              }}
            >
              <Text style={{ color: selected ? 'white' : 'black', fontWeight: '500' }}>{brand}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Filter;
