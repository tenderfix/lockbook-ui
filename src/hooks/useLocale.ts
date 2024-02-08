import { useEffect } from 'react';
import { sessionStore } from '../session/session.store';
import { useTranslation } from 'react-i18next';
import { Locale } from '../i18n/locales';

export const useLocale = (): void => {
  const { i18n } = useTranslation();
  const locale = i18n.language as Locale;

  useEffect(() => sessionStore.applyLocale(locale), []);
};
