import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

// Import SVG
import SettingIcon from 'assets/icons/Setting.svg';

const pathTitles: { [key: string]: string } = {
  '/': 'Kodu',
  '/fuel': 'Kütuse Hinnad',
  '/electricity': 'Elektri Hinnad',
  '/map': 'Kaart',
  '/settings': 'Seaded',
};

const Header = () => {
  const [title, setTitle] = useState<string>('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setTitle(pathTitles[pathname]);
  }, [pathname]);

  return (
    <View className="border-b-2 border-gray-100 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-center text-3xl font-bold">{title || 'Page Name'}</Text>

        <TouchableOpacity
          onPress={() => {
            router.push('/settings');
          }}
          className="items-center justify-center">
          <SettingIcon fill="#9A8C8C" width={36} height={36} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
