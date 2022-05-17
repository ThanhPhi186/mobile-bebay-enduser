import {PayloadAction} from '@reduxjs/toolkit';
import {createHandleReducer, IBaseReducerState} from 'helpers/reduxHelpers';
import {IUser} from 'models/IUser';
import {IInitDataResponse} from 'models/services/IInitData';
import {ILoginResponse} from 'models/services/ILogin';
import {AuthenticationActions} from 'stores/actions';

interface IAuthenticationState extends IBaseReducerState {
  userInfo?: IUser;
  accountNumber?: string;
  accessToken?: string;
  rsaPrivateKey?: string;
  rsaPublicKey?: string;
  refreshToken?: string;
  loginToken?: string;
  signatureKey?: string;
  initAccessToken?: string;
  useBiometric: boolean | undefined;
  onBoarded: boolean;
  isFirstTime: boolean;
  pin?: string;
  skipLogin?: boolean;
  urlInvite?: string;
  failedInit?: boolean;
  isShowIntro?: Array<string>;
  referralNumber?: string;
}

const initialState: IAuthenticationState = {
  useBiometric: undefined,
  onBoarded: false,
  isFirstTime: false,
  isShowIntro: [],
};
const setAuthenticationData = (
  state: IAuthenticationState,
  action: PayloadAction<ILoginResponse>,
) => {
  // state.loggedIn = true;
  const {payload} = action;
  state.userInfo = payload.userInfo;
  state.loginToken = payload.loginToken;
  state.refreshToken = payload.refreshToken;
  state.pin = payload.pin;
  state.urlInvite = payload.url;
};
const logOut = (state: IAuthenticationState) => {
  state.userInfo = undefined;
  state.loginToken = undefined;
  state.refreshToken = undefined;
  state.skipLogin = undefined;
};
const kickedOut = (state: IAuthenticationState) => {
  state.userInfo = undefined;
  state.loginToken = undefined;
  state.refreshToken = undefined;
  state.accessToken = undefined;
  state.initAccessToken = undefined;
  state.rsaPrivateKey = undefined;
  state.rsaPublicKey = undefined;
  state.accountNumber = undefined;
  state.skipLogin = undefined;
};
const isShowIntro = (
  state: IAuthenticationState,
  action: PayloadAction<Array<string>>,
) => {
  state.isShowIntro = action.payload;
};
const setBiometric = (
  state: IAuthenticationState,
  action: PayloadAction<boolean>,
) => {
  state.useBiometric = action.payload;
};
const setInitAccessToken = (
  state: IAuthenticationState,
  action: PayloadAction<string>,
) => {
  state.initAccessToken = action.payload;
};
const initDataSuccess = (
  state: IAuthenticationState,
  action: PayloadAction<IInitDataResponse>,
) => {
  const {payload} = action;
  state.accessToken = payload.accessToken;
  state.signatureKey = payload.signatureKey;
  state.rsaPrivateKey = payload.rsaPrivateKey;
  state.rsaPublicKey = payload.rsaPublicKey;
  state.failedInit = false;

  state.action = AuthenticationActions.initData.successName;
};
const initDataFailed = (state: IAuthenticationState) => {
  state.failedInit = true;

  state.action = AuthenticationActions.initData.failedName;
};

const AuthenticationReducer = createHandleReducer(initialState, builder => {
  builder
    .addCase(
      AuthenticationActions.setAuthenticationData.request,
      setAuthenticationData,
    )
    .addCase(AuthenticationActions.logout.request, logOut)
    .addCase(AuthenticationActions.kickedOut.request, kickedOut)
    .addCase(AuthenticationActions.setBiometric.request, setBiometric)
    .addCase(AuthenticationActions.initData.success, initDataSuccess)
    .addCase(AuthenticationActions.initData.failed, initDataFailed)
    .addCase(AuthenticationActions.setShowIntro.request, isShowIntro)

    .addCase(
      AuthenticationActions.setAccountNumber.request,
      (state: IAuthenticationState, action: PayloadAction<string>) => {
        state.accountNumber = action.payload;
      },
    )
    .addCase(
      AuthenticationActions.setInitAccessToken.request,
      setInitAccessToken,
    )
    .addCase(
      AuthenticationActions.firstTime.request,
      (state: IAuthenticationState) => {
        state.isFirstTime = true;
      },
    )
    .addCase(
      AuthenticationActions.skipLogin.request,
      (state: IAuthenticationState, action: PayloadAction<boolean>) => {
        state.skipLogin = action.payload;
      },
    )
    .addCase(
      AuthenticationActions.boarded.request,
      (state: IAuthenticationState) => {
        state.onBoarded = true;
      },
    )
    .addCase(
      AuthenticationActions.initShowIntro.request,
      (state: IAuthenticationState) => {
        state.isShowIntro = [];
      },
    )
    .addCase(
      AuthenticationActions.setReferralNumber.request,
      (state: IAuthenticationState, action: PayloadAction<string>) => {
        state.referralNumber = action.payload;
      },
    )

    .addCase(
      AuthenticationActions.setPin.request,
      (state: IAuthenticationState, action: PayloadAction<string>) => {
        state.pin = action.payload;
      },
    );
});

export default AuthenticationReducer;
