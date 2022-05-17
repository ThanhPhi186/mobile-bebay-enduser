import {ReduxHelper} from 'helpers';
import {IInitDataRequest, IInitDataResponse} from 'models/services/IInitData';
import {ILoginRequest, ILoginResponse} from 'models/services/ILogin';

export const prefix = 'TRANSFER';
export const checkSub = ReduxHelper.generateLocalAction<undefined>(
  prefix,
  'CHECKSUB',
);