import i18n from 'i18next';
import en_translation from './lang/en/translation.json';
import fr_translation from './lang/fr/translation.json';
import ht_translation from './lang/ht/translation.json';

import {initReactI18next, useTranslation} from 'react-i18next';
import {convertLanguageJsonToObject} from './translations';
export {translations} from './translations';
convertLanguageJsonToObject(en_translation);
export enum ELanguage {
  EN = 'en',
  FR = 'fr',
  HT = 'ht',
}
export const resources = {
  en: {
    translation: en_translation,
  },
  fr: {
    translation: fr_translation,
  },
  ht: {
    translation: ht_translation,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
});
