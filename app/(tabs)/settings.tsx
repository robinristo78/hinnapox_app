import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'contexts/LanguageContext';

const Settings = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fuelNotification, setFuelNotification] = useState(false);
  const [electricityNotification, setElectricityNotification] = useState(false);

  return (
    <View className="px-6 pt-6">
      <Text className="mb-2 ml-1 text-gray-500">{t('language')}</Text>
      <View className="mb-6 flex-row gap-3">
        <TouchableOpacity
          onPress={() => setLanguage('et')}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            language === 'et' ? 'bg-theme-blue' : 'bg-[#E5E5EA]'
          }`}>
          <Text
            className={`text-lg font-medium ${language === 'et' ? 'text-white' : 'text-black'}`}>
            {t('estonian')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('en')}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            language === 'en' ? 'bg-theme-blue' : 'bg-[#E5E5EA]'
          }`}>
          <Text
            className={`text-lg font-medium ${language === 'en' ? 'text-white' : 'text-black'}`}>
            {t('english')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-2 ml-1 text-gray-500">{t('style')}</Text>

      <View className="mb-4 flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
        <Text className="text-xl font-semibold text-black">{t('darkMode')}</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#E5E5EA', true: '#128AEB' }}
          thumbColor={'#FFFFFF'}
          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
        />
      </View>

      <Text className="mb-2 ml-1 text-gray-500">{t('notifications')}</Text>
      <View className="flex-col gap-4 ">
        <View className="flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <Text className="text-xl font-semibold text-black">{t('fuelPriceDropped')}</Text>
          <Switch
            value={fuelNotification}
            onValueChange={setFuelNotification}
            trackColor={{ false: '#E5E5EA', true: '#128AEB' }}
            thumbColor={'#FFFFFF'}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        </View>
        <View className="flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <Text className="text-xl font-semibold text-black">{t('electricityPriceDropped')}</Text>
          <Switch
            value={electricityNotification}
            onValueChange={setElectricityNotification}
            trackColor={{ false: '#E5E5EA', true: '#128AEB' }}
            thumbColor={'#FFFFFF'}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        </View>
      </View>
    </View>
  );
};

export default Settings;
