import {images} from 'assets';
import {ELanguage} from 'utils/i18n';

export const ListLanguage: ILanguage[] = [
  {
    icon: images.IconUK,
    id: ELanguage.EN,
  },
  {
    icon: images.IconFrance,
    id: ELanguage.FR,
  },
  {
    icon: images.iconHaiti,
    id: ELanguage.HT,
  },
];

export interface ILanguage {
  icon: any;
  id: ELanguage;
}
