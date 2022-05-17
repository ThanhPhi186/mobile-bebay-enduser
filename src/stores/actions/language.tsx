import {ReduxHelper} from 'helpers';
import {ELanguage} from 'utils/i18n';

export const prefix = 'LANGUAGE';
export const changeLanguage = ReduxHelper.generateLocalAction<ELanguage>(
  prefix,
  'CHANGE_LANGUAGE',
);
