import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Cargar traducciones desde archivos
  .use(LanguageDetector) // Detectar el idioma automáticamente
  .use(initReactI18next) // Integrar con React
  .init({
    fallbackLng: 'en', // Idioma por defecto si no encuentra uno disponible
    debug: true,
    interpolation: {
      escapeValue: false, // React ya maneja el escape de caracteres
    },
    backend: {
      loadPath: './locales/{{lng}}/translation.json', // Ruta de las traducciones
    },
  });

export default i18n;
