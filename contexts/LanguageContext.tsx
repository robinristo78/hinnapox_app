import React, { createContext, useContext, useEffect } from 'react';
import i18n, { changeLanguage, init } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Locales
import en from '../locales/en.json';
import et from '../locales/et.json';
import zhCN from '../locales/zh-CN.json'; // Import Simplified Chinese translations
import zhTW from '../locales/zh-TW.json'; // Import Traditional Chinese translations

// Initialize i18next
if (!i18n.isInitialized) {
  init({
    lng: 'et',
    fallbackLng: 'et',
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
      en: { translation: en },
      et: { translation: et },
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

type Language = 'en' | 'et' | 'zh-CN' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LANGUAGE_STORAGE_KEY = 'LANGUAGE_PREFERENCE';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState<Language>('et');

  const syncLanguage = async () => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const handleSetLanguage = (language: Language) => {
    setLanguage(language);
    changeLanguage(language);

    syncLanguage();
  };

  useEffect(() => {
    const loadLang = async () => {
      try {
        const storedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLang) {
          handleSetLanguage(storedLang as Language);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLang();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
