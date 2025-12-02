import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

type FilterProps = {
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  allBrands: string[];
};

const Filter: React.FC<FilterProps> = ({ selectedBrands, toggleBrand, allBrands }) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'white',
        paddingVertical: 8,
      }}
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
                backgroundColor: selected ? '#007AFF' : '#E0E0E0',
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
