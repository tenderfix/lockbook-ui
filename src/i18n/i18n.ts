import i18next, { ResourceLanguage } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationDE from './translations/de.json';
import translationEN from './translations/en.json';
import { DEFAULT_LOCALE, Locale } from './locales';

const languageResources: { [key in Locale]: ResourceLanguage } = {
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
};

// Initializing it as an instance is actually important to use it with <I18nextProvider />
const i18n = i18next.createInstance();

// The LanguageDetector needs to be used before initialization otherwise the i18nextLng from localStorage won't work.
i18n.use(LanguageDetector).init({
  debug: process.env.NODE_ENV === 'development',
  resources: languageResources,
  fallbackLng: DEFAULT_LOCALE,
  react: { useSuspense: false },
});

export default i18n;
