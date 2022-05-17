import {PayloadAction} from '@reduxjs/toolkit';
import {IBalanceResponse} from 'models/services/IBalance';
import {put, takeEvery, call} from 'redux-saga/effects';
import BalanceServices from 'services/BalanceServices';
import {IApiResponse} from 'services/BaseApiService';
import {UserActions} from 'stores/actions';

function* getBalanceAsync(action: PayloadAction<undefined>) {
  try {
    const result: IApiResponse<IBalanceResponse> = yield call(
      BalanceServices.getBalance,
    );
    if (result.succeeded && !result.failed) {
      yield put(UserActions.getBalance.success(result.data!));
    }
  } catch (error) {}
}

export function* Watcher() {
  yield takeEvery(UserActions.getBalance.request, getBalanceAsync);
}
