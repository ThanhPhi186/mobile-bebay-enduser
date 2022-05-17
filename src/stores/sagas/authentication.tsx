import {PayloadAction} from '@reduxjs/toolkit';
import {EncryptHelper, KeysHelper} from 'helpers';
import {IInitDataRequest, IInitDataResponse} from 'models/services/IInitData';
import {ILoginRequest, ILoginResponse} from 'models/services/ILogin';
import {put, takeEvery, call, select} from 'redux-saga/effects';
import {IApiResponse} from 'services/BaseApiService';
import InitServices from 'services/InitServices';
import AuthenticationService from 'services/AuthenticationServices';
import {AuthenticationActions} from 'stores/actions';
import {RootReducer} from 'stores/configurations/rootReducer';
const getDeviceId = (state: RootReducer) => state.AppReducer.deviceId;

function* initDataAsync(action: PayloadAction<IInitDataRequest>) {
  try {
    const initDataResponse: IApiResponse<IInitDataResponse> = yield call(
      InitServices.getInitData,
      action.payload,
    );
    if (initDataResponse.succeeded) {
      const buildId: string = yield call(KeysHelper.getBuildKey);
      const deviceId: string = yield select(getDeviceId);
      const accessToken: string = yield call(
        EncryptHelper.encryptString,
        `${deviceId}##${buildId}`,
        initDataResponse.data?.rsaPublicKey!,
      );
      yield put(
        AuthenticationActions.initData.success({
          ...initDataResponse.data!,
          accessToken,
        }),
      );
    } else {
      yield put(
        AuthenticationActions.initData.failed({
          ...initDataResponse.data!,
        }),
      );
    }
  } catch (error) {}
}

export function* Watcher() {
  yield takeEvery(AuthenticationActions.initData.request, initDataAsync);
}
