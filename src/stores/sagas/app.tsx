import {PayloadAction} from '@reduxjs/toolkit';
import {put, takeEvery, call} from 'redux-saga/effects';

function* loginAsync(action: PayloadAction<any>) {
  try {
  } catch (error) {}
}

export function* Watcher() {
  yield takeEvery('test', loginAsync);
}
