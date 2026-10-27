import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';

// Default to Spanish ('es') for SEO unless URL or explicit user setting requests English ('en')
const getInitialLanguage = (): string => {
  try {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.startsWith('/en') || p === '/store' || p === '/watch-listen' || p === '/about') {
        return 'en';
      }
      const stored = localStorage.getItem('i18n_lang');
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
    }
  } catch {}
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
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('i18n_lang', lng);
  } catch {}
});

export default i18n;
