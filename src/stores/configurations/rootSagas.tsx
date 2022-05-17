import {all} from 'redux-saga/effects';

import {AppSaga, AuthenticationSaga, UserSaga, ContactSaga} from '../sagas';

export default function* watch() {
  yield all([
    AppSaga.Watcher(),
    AuthenticationSaga.Watcher(),
    UserSaga.Watcher(),
    ContactSaga.Watcher(),
  ]);
}
