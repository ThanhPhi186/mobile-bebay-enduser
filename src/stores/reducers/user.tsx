import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {AlertType} from 'models/EAlertType';
import {IBalanceResponse} from 'models/services/IBalance';
import {AppActions, UserActions} from 'stores/actions';
import {
  IBaseReducerState,
  createHandleReducer,
} from '../../helpers/reduxHelpers';
import {IAppConfig} from '../../models/IAppConfig';
interface IUserState extends IBaseReducerState {
  balance?: string;
  avatar?: string;
  totalNumberUnread?: number;
}

const initialState: IUserState = {};

const getBalanceSuccess = (
  state: IUserState,
  action: PayloadAction<IBalanceResponse>,
) => {
  state.balance = action.payload.balance;
};

const setAvatar = (state: IUserState, action: PayloadAction<string>) => {
  state.avatar = action.payload;
};
const setNotificationUnread = (
  state: IUserState,
  action: PayloadAction<number>,
) => {
  state.totalNumberUnread = action.payload;
};
const UserReducer = createHandleReducer(initialState, builder => {
  builder
    .addCase(UserActions.getBalance.success, getBalanceSuccess)
    .addCase(UserActions.setAvatar.request, setAvatar)
    .addCase(UserActions.setTotalNumberUnread.request, setNotificationUnread);
});

export default UserReducer;
