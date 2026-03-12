import es from './es';
import en from './en';
import pt from './pt';

const translations = { es, en, pt };

export const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export function useTranslation(language = 'es') {
  const dict = translations[language] ?? translations.es;

  function t(key, vars) {
    const value = resolve(dict, key);
    if (!value) return key;
    return interpolate(value, vars);
  }

  return { t };
}