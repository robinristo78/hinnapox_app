import React from "react";
import { View, TouchableOpacity} from 'react-native';
import { router, usePathname } from 'expo-router';

//SVG import
import HomeIcon from 'assets/icons/Home.svg';
import FuelIcon from 'assets/icons/Fuel.svg';
import ElectricIcon from 'assets/icons/Electricity.svg';
import MapIcon from 'assets/icons/Map.svg';

type NavItem = {
  key: string;
  route: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const navItems = [
    {key: 'home', route: '/home', Icon: HomeIcon},
    {key: 'fuel', route: '/fuel', Icon: FuelIcon},
    {key: 'electricity', route: '/electricity', Icon: ElectricIcon},
    {key: 'map', route: '/map', Icon: MapIcon}
]

export default function NavBar() {
    // Takes the current pathname/tab.
    const pathname = usePathname();

    return (
        <View className="flex-row justify-around items-center py-3 bg-gray-100">
            {
                navItems.map(({key, route, Icon}) => {
                    const isActive = pathname === route;
                    return (
                        <TouchableOpacity 
                            key={key}
                            onPress={() => router.push(route)}
                            className="items-center"
                        >
                            <Icon
                                width={24}
                                height={24}
                                fill={isActive ? "#64AEF0" : "#9A8C8C"}
                            />
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}