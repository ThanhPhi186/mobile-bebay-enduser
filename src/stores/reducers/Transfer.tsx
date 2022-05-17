import { PayloadAction } from '@reduxjs/toolkit';
import { createHandleReducer, IBaseReducerState } from 'helpers/reduxHelpers';
import { IUser } from 'models/IUser';
import { IInitDataResponse } from 'models/services/IInitData';
import { ILoginResponse } from 'models/services/ILogin';
import { AuthenticationActions, TransferActions } from 'stores/actions';

interface ITransferState extends IBaseReducerState {
  userInfo?: IUser;
  accountNumber?: string;
  accessToken?: string;
  rsaPrivateKey?: string;
  rsaPublicKey?: string;
  refreshToken?: string;
  // loginToken?: string;
  signatureKey?: string;
  initAccessToken?: string;
  useBiometric: boolean | undefined;
  onBoarded: boolean;
  isFirstTime: boolean;
  pin?: string;
}

const initialState: ITransferState = {
  useBiometric: undefined,
  onBoarded: false,
  isFirstTime: false,
};
const setAuthenticationData = (
  state: ITransferState,
  action: PayloadAction<ILoginResponse>,
) => {
  // state.loggedIn = true;
  const { payload } = action;
  state.userInfo = payload.userInfo;
  // state.loginToken = payload.loginToken;
  state.refreshToken = payload.refreshToken;
  state.pin = payload.pin;
};
const checkSubSuccess = (state: ITransferState) => {
  console.log("ITransferState", state);
  
  state.accountNumber = undefined;
};
const setBiometric = (
  state: ITransferState,
  action: PayloadAction<boolean>,
) => {
  state.useBiometric = action.payload;
};
const setInitAccessToken = (
  state: ITransferState,
  action: PayloadAction<string>,
) => {
  state.initAccessToken = action.payload;
};

const initDataSuccess = (
  state: ITransferState,
  action: PayloadAction<IInitDataResponse>,
) => {
  const { payload } = action;
  state.accessToken = payload.accessToken;
  state.signatureKey = payload.signatureKey;
  state.rsaPrivateKey = payload.rsaPrivateKey;
  state.rsaPublicKey = payload.rsaPublicKey;
};

const TransferReducer = createHandleReducer(initialState, builder => {
  builder
    .addCase(TransferActions.checkSub.request, checkSubSuccess);
});

export default TransferReducer;
