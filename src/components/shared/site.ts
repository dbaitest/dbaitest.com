// Locale model and site-wide constants shared by the hub, the product landing pages and
// their typed string dictionaries.
export const LOCALES = ['en', 'vi'] as const;
export type Locale = (typeof LOCALES)[number];
/** A dictionary entry with one value per locale; a missing locale is a type error. */
export type Localized<T> = Record<Locale, T>;

export interface Link {
  label: string;
  href: string;
}

export const SITE_ORIGIN = 'https://dbaitest.com';
export const GITHUB_URL = 'https://github.com/dbaitest';

export const otherLocale = (locale: Locale): Locale => (locale === 'en' ? 'vi' : 'en');

/** Site path for `path` (leading and trailing slash) in `locale`; English lives at the root. */
export const localePath = (locale: Locale, path: string): string => (locale === 'en' ? path : `/vi${path}`);

export const absoluteUrl = (locale: Locale, path: string): string => `${SITE_ORIGIN}${localePath(locale, path)}`;
