import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';

// Detect initial language: LocalStorage -> Browser Language -> default 'es'
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('i18n_lang');
  if (stored === 'es' || stored === 'en') {
    return stored;
  }
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang && browserLang.toLowerCase().startsWith('en')) {
    return 'en';
  }
  
  return 'es';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: esTranslation },
      en: { translation: enTranslation }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

// Listen to language change to synchronize LocalStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n_lang', lng);
});

export default i18n;
