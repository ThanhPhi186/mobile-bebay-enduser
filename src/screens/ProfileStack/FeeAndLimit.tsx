import React, { useEffect } from 'react';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import { useAppSelector, useBaseHook } from 'helpers/hookHelper';
import { WebView } from 'react-native-webview';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useLoadingContext } from 'helpers/loadingHelper';
import { KeysHelper, Mixin } from 'helpers';
import AppText from 'components/atoms/AppText';
import { buildVersion } from 'utils/Const';
import { Icon } from 'react-native-elements';
import _ from 'lodash';

export const FeeAndLimit = () => {
  const appConfig = useAppSelector(state => state.AppReducer.appConfig);

  const language = useAppSelector(state => state.LanguageReducer.language);
  const url = appConfig[`feeandlimit_url_${language}`];

  const { t, translations } = useBaseHook();
  const { showLoading, hideLoading } = useLoadingContext();
  const newVersionApp = useAppSelector(state =>
    state.NewAppVersionReducer ? state.NewAppVersionReducer.newVersion : null,
  );
  useEffect(() => {
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 1000);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppHeader filled title={t(translations.profile.feeAndLimit)} />
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            padding: 15,
          }}>
          <WebView
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            originWhitelist={['*']}
            style={{ width: '100%', flex: 1, borderRadius: 10 }}
            source={{ uri: `${url}` }}
          />
        </View>
      </View>
    </View>
  );
};
