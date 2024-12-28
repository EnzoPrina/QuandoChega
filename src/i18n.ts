import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'es', // Idioma predeterminado
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        select_language: 'Select Language',
        close: 'Close',
        home: 'Home',
        lines: 'Lines',
        map: 'Map',
      },
    },
    es: {
      translation: {
        select_language: 'Seleccionar Idioma',
        close: 'Cerrar',
        home: 'Inicio',
        lines: 'Líneas',
        map: 'Mapa',
      },
    },
    pt: {
      translation: {
        select_language: 'Selecionar idioma',
        close: 'Fechar',
        home: 'Início',
        lines: 'Linhas',
        map: 'Mapa',
      },
    },
  },
});

export default i18n;
