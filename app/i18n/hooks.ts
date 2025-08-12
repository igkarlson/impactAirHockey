import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((language: 'en' | 'ru') => {
    i18n.changeLanguage(language);
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    currentLanguage: i18n.language,
  };
}; 