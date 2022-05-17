import {ReduxHelper} from 'helpers';
import {INewAppVersion} from 'models/services/IHome';

export const prefix = 'NEW_VERSION';
export const setNewVersion = ReduxHelper.generateLocalAction<INewAppVersion>(
  prefix,
  'SET_NEW_VERSION',
);
