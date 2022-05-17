import {PayloadAction} from '@reduxjs/toolkit';
import {
  EInviteType,
  IInviteInfoRequest,
  IInviteInfoResponse,
} from 'models/services/IInvite';
import {put, takeEvery, call} from 'redux-saga/effects';
import {IApiResponse} from 'services/BaseApiService';
import InviteServices from 'services/InviteServices';
import {ContactActions} from 'stores/actions';

function* getInfoAsync(action: PayloadAction<IInviteInfoRequest>) {
  try {
    const response: IApiResponse<IInviteInfoResponse> = yield call(
      InviteServices.inviteInfo,
      action.payload,
    );
    if (response.succeeded) {
      if (action.payload.type === EInviteType.INVITE) {
        yield put(ContactActions.getInfoInvite.success(response.data!));
      } else {
        yield put(ContactActions.getInfoNotInvite.success(response.data!));
      }
    }
  } catch (error) {}
}

export function* Watcher() {
  yield takeEvery(ContactActions.getInfoInvite.request, getInfoAsync);
}
