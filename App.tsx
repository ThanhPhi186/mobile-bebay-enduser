import React, {useEffect, useState} from 'react';

import {Provider} from 'react-redux';
import configureStore from './src/stores/configurations/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import {MainApp} from './src/navigation/MainApp';
import codePush, {SyncOptions} from 'react-native-code-push';
import {setJSExceptionHandler} from 'react-native-exception-handler';
import {LoadingProvider} from './src/helpers/loadingHelper';
import {Alert} from 'react-native';

const errorHandler = (e: Error, isFatal: boolean) => {
  if (isFatal) {
    console.log('sadsadsa', e);
    Alert.alert(
      'Error',
      'There is a problem with Natcash app, please contact us for more information',
      [{text: 'Close'}],
    );
  } else {
  }
};

setJSExceptionHandler(errorHandler, true);
// configureStore().persistor.purge();
//try git commit Locnm_mascom
const NatCash = () => {
  return (
    <Provider store={configureStore().store}>
      <PersistGate loading={null} persistor={configureStore().persistor}>
        <LoadingProvider>
          <MainApp />
        </LoadingProvider>
      </PersistGate>
    </Provider>
  );
};
export default codePush({
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE,
})(NatCash);
