import {createStore, compose, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducers, {RootReducer} from './rootReducer';
import rootSagas from './rootSagas';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import {PersistConfig} from 'redux-persist/es/types';
import i18next from 'i18next';
import {AppActions, AuthenticationActions} from 'stores/actions';
import uuid from 'react-native-uuid';
import {Platform} from 'react-native';
const BLACK_LIST: Array<keyof RootReducer> = [
  'OTPReducer',
  'NewAppVersionReducer',
];
const config: PersistConfig<RootReducer> = {
  key: 'root',
  timeout: 0,
  storage: AsyncStorage,
  debug: true,
  stateReconciler: hardSet,
  blacklist: BLACK_LIST as Array<string>,
};
const sagaMiddleware = createSagaMiddleware();
const middleware = [];
middleware.push(sagaMiddleware);
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
} else {
  // production code
}
const reducers = persistReducer(config, rootReducers);
const enhancers = [applyMiddleware(...middleware)];
const persistConfig = {enhancers};
const store = createStore(reducers, {}, compose(...enhancers));
const persistor = persistStore(store, persistConfig as any, () => {
  const stateData = store.getState();
  if (!stateData.AuthenticationReducer.isShowIntro) {
    store.dispatch(AuthenticationActions.initShowIntro.request());
  }
  if (!stateData.AppReducer.deviceId) {
    if (!_.isEmpty(stateData.AuthenticationReducer.initAccessToken)) {
      store.dispatch(
        AppActions.setDeviceId.request(
          DeviceInfo.getUniqueId().replace(/-/g, ''),
        ),
      );
    } else {
      const deviceId =
        Platform.OS === 'android' ? `${uuid.v4()}` : DeviceInfo.getUniqueId();
      store.dispatch(
        AppActions.setDeviceId.request(deviceId.replace(/-/g, '')),
      );
    }
  }
  if (stateData.LanguageReducer.language) {
    i18next.changeLanguage(stateData.LanguageReducer.language);
  }
});
const configureStore = () => {
  return {persistor, store};
};
sagaMiddleware.run(rootSagas);
export default configureStore;
