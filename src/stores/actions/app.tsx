import {ReduxHelper} from 'helpers';
import {IAppConfig} from '../../models/IAppConfig';

export const prefix = 'APP';
export const setConfig = ReduxHelper.generateLocalAction<IAppConfig>(
  prefix,
  'SET_CONFIG',
);
export const setServerDown = ReduxHelper.generateLocalAction<boolean>(
  prefix,
  'SET_SERVER_DOWN',
);
export const setDeviceId = ReduxHelper.generateLocalAction<string>(
  prefix,
  'SET_DEVICE_ID',
);
