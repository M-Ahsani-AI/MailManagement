// hooks/useTranslation.js
import { useState, useEffect } from 'react';
import { translations } from '../utils/translation';

export const useTranslation = () => {
  const [language, setLanguage] = useState('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'id';
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return { t, language, changeLanguage };
};