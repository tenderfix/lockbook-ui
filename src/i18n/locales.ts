export type Locale = 'de' | 'en';

export const LOCALE_TO_LANGUAGE_MAP: Record<Locale, string> = {
  de: 'Deutsch (DE)',
  en: 'English (EN)',
};

export const Locales = Object.keys(LOCALE_TO_LANGUAGE_MAP) as Locale[];

export const DEFAULT_LOCALE: Locale = 'de';
