import {ReduxHelper} from 'helpers';
import {IInitDataRequest, IInitDataResponse} from 'models/services/IInitData';
import {ILoginRequest, ILoginResponse} from 'models/services/ILogin';

export const prefix = 'AUTHENTICATION';
export const boarded = ReduxHelper.generateLocalAction<undefined>(
  prefix,
  'BOARDED',
);
export const firstTime = ReduxHelper.generateLocalAction<undefined>(
  prefix,
  'FIRST_TIME',
);
export const setBiometric = ReduxHelper.generateLocalAction<boolean>(
  prefix,
  'SET_BIOMETRIC',
);
export const setInitAccessToken = ReduxHelper.generateLocalAction<string>(
  prefix,
  'INIT_ACCESS_TOKEN',
);
export const skipLogin = ReduxHelper.generateLocalAction<boolean>(
  prefix,
  'SKIP_LOGIN',
);
export const setAccountNumber = ReduxHelper.generateLocalAction<string>(
  prefix,
  'SET_ACCOUNT_NUMBER',
);
export const setPin = ReduxHelper.generateLocalAction<string>(
  prefix,
  'SET_PIN',
);
export const initData = ReduxHelper.generateActions<
  IInitDataRequest,
  IInitDataResponse
>(prefix, 'INIT_DATA');
export const setAuthenticationData =
  ReduxHelper.generateLocalAction<ILoginResponse>(
    prefix,
    'SET_AUTHENTICATION_DATA',
  );
export const logout = ReduxHelper.generateActions<undefined>(prefix, 'LOGOUT');
export const kickedOut = ReduxHelper.generateActions<undefined>(
  prefix,
  'KICKED_OUT',
);
export const setShowIntro = ReduxHelper.generateLocalAction<string[]>(
  prefix,
  'IS_SHOW_INTRO',
);
export const initShowIntro = ReduxHelper.generateLocalAction<undefined>(
  prefix,
  'INIT_SHOW_INTRO',
);
export const setReferralNumber = ReduxHelper.generateLocalAction<string>(
  prefix,
  'SET_REFERRAL_NUMBER',
);
