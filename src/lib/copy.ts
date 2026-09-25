import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

export const dictionaries = { en, ar } as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: string | null | undefined): Dictionary {
  return locale === 'ar' ? ar : en;
}
