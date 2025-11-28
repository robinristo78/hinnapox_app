import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'contexts/LanguageContext';
import { useTheme } from 'contexts/ThemeContext';
import { useColorScheme } from 'nativewind';

const Settings = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [fuelNotification, setFuelNotification] = useState(false);
  const [electricityNotification, setElectricityNotification] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <View className="px-6 pt-6">
      <Text className="mb-2 ml-1 text-gray-500">{t('language')}</Text>
      <View className="mb-6 flex-row gap-3">
        <TouchableOpacity
          onPress={() => setLanguage('et')}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            language === 'et' ? 'bg-theme-blue' : 'bg-theme-secondary dark:bg-theme-dark-secondary'
          }`}>
          <Text
            className={`text-lg font-medium ${language === 'et' ? 'text-white' : 'text-black dark:text-white'}`}>
            {t('estonian')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('en')}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            language === 'en' ? 'bg-theme-blue' : 'bg-theme-secondary dark:bg-theme-dark-secondary'
          }`}>
          <Text
            className={`text-lg font-medium ${language === 'en' ? 'text-white' : 'text-black dark:text-white'}`}>
            {t('english')}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="mb-6 flex-row gap-3">
        <TouchableOpacity
          onPress={() => setLanguage('zh-CN')}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            language === 'zh-CN'
              ? 'bg-theme-blue'
              : 'bg-theme-secondary dark:bg-theme-dark-secondary'
          }`}>
          <Text
            className={`text-lg font-medium ${language === 'zh-CN' ? 'text-white' : 'text-black dark:text-white'}`}>
            {t('zh-CN')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('zh-TW')}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            language === 'zh-TW'
              ? 'bg-theme-blue'
              : 'bg-theme-secondary dark:bg-theme-dark-secondary '
          }`}>
          <Text
            className={`text-lg font-medium ${language === 'zh-TW' ? 'text-white' : 'text-black dark:text-white'}`}>
            {t('zh-TW')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-2 ml-1 text-gray-500">{t('style')}</Text>

      <View className="mb-4 flex-row items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-theme-dark-tertiary">
        <Text className="text-xl font-semibold text-black dark:text-white">{t('darkMode')}</Text>
        <Switch
          value={colorScheme === 'dark'}
          onValueChange={(value) => setTheme(value ? 'dark' : 'light')}

          trackColor={{ false: 'theme-secondary', true: '#128AEB' }}
          thumbColor={'#FFFFFF'}
          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
        />
      </View>

      <Text className="mb-2 ml-1 text-gray-500">{t('notifications')}</Text>
      <View className="flex-col gap-4 ">
        <View className="flex-row items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-theme-dark-tertiary">
          <Text className="text-xl font-semibold text-black dark:text-white">
            {t('fuelPriceDropped')}
          </Text>
          <Switch
            value={fuelNotification}
            onValueChange={setFuelNotification}
            trackColor={{ false: 'theme-secondary', true: '#128AEB' }}
            thumbColor={'#FFFFFF'}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        </View>
        <View className="flex-row items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-theme-dark-tertiary">
          <Text className="text-xl font-semibold text-black dark:text-white">
            {t('electricityPriceDropped')}
          </Text>
          <Switch
            value={electricityNotification}
            onValueChange={setElectricityNotification}
            trackColor={{ false: 'theme-secondary', true: '#128AEB' }}
            thumbColor={'#FFFFFF'}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        </View>
      </View>
    </View>
  );
};

export default Settings;
