import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SvgProps } from 'react-native-svg';
import { useColorScheme } from 'nativewind';

//SVG import
import HomeIcon from 'assets/icons/Home.svg';
import FuelIcon from 'assets/icons/Fuel.svg';
import ElectricIcon from 'assets/icons/Electricity.svg';
import MapIcon from 'assets/icons/Map.svg';

type NavItem = {
  key: string;
  route: string;
  Icon: React.FC<SvgProps>;
};

const navItems: NavItem[] = [
  { key: 'home', route: '/', Icon: HomeIcon },
  { key: 'fuel', route: '/fuel', Icon: FuelIcon },
  { key: 'electricity', route: '/electricity', Icon: ElectricIcon },
  { key: 'map', route: '/map', Icon: MapIcon },
];

export default function NavBar() {
  // Takes the current pathname/tab.
  const pathname = usePathname();
  const router = useRouter();

  // Color scheme for dark mode support
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#647373' : '#9A8C8C';

  return (
    <View className="flex-row items-center justify-around bg-gray-100 py-3 dark:bg-theme-dark-secondary">
      {navItems.map(({ key, route, Icon }) => {
        const isActive = pathname === route;
        return (
          <TouchableOpacity key={key} onPress={() => router.push(route)} className="items-center">
            <Icon width={44} height={44} fill={isActive ? '#007AFF' : iconColor} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
