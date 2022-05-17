import {ReduxHelper} from 'helpers';
import {IBalanceResponse} from 'models/services/IBalance';

export const prefix = 'USER';
export const getBalance = ReduxHelper.generateActions<
  undefined,
  IBalanceResponse
>(prefix, 'GET_BALANCE');
export const setAvatar = ReduxHelper.generateLocalAction<string>(
  prefix,
  'SET_AVATAR',
);
export const setTotalNumberUnread = ReduxHelper.generateLocalAction<number>(
  prefix,
  'SET_NOTIFICATION_UNREAD',
);
