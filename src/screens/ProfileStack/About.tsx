import React, {useEffect} from 'react';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import {WebView} from 'react-native-webview';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {useLoadingContext} from 'helpers/loadingHelper';
import {KeysHelper, Mixin} from 'helpers';
import AppText from 'components/atoms/AppText';
import {buildVersion} from 'utils/Const';
import {Icon} from 'react-native-elements';
import _ from 'lodash';

export const About = () => {
  const appConfig = useAppSelector(state => state.AppReducer.appConfig);
  
  const language = useAppSelector(state => state.LanguageReducer.language);
  const url = appConfig[`natcash_url_${language}`];
  const {t, translations} = useBaseHook();
  const {showLoading, hideLoading} = useLoadingContext();
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
    <View style={{flex: 1}}>
      <AppHeader filled title={t(translations.profile.aboutNatCash)} />
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          padding: Mixin.moderateSize(8),
        }}>
        <View>
          <AppText subtitle2>
            {`${t(translations.profile.version)} ${KeysHelper.getVersion()}`}
          </AppText>
          <AppText
            style={{marginTop: Mixin.moderateSize(4)}}
            caption>{`Build ${buildVersion}`}</AppText>
        </View>
        {newVersionApp && (
          <TouchableOpacity
            onPress={async () => {
              const canOpen = await Linking.canOpenURL(
                `${newVersionApp.appStoreUrl}`,
              );
              if (canOpen) {
                Linking.openURL(`${newVersionApp.appStoreUrl}`);
              }
            }}
            style={{
              backgroundColor: '#00659F',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: Mixin.moderateSize(5),
              padding: Mixin.moderateSize(6),
            }}>
            <Icon color={'white'} name="upload" />
            <View style={{marginLeft: Mixin.moderateSize(8)}}>
              <AppText
                subtitle3
                style={{color: 'white', fontSize: 14}}>{`Upgrade`}</AppText>
              <AppText
                style={{
                  color: 'white',
                  fontSize: 11,
                }}>{`Version ${newVersionApp?.appVersion}`}</AppText>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#EEF0F4',
          padding: 15,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100%',
            paddingHorizontal: 10,
            borderRadius: 15,
            paddingVertical: 20,
          }}>
          <WebView
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            originWhitelist={['*']}
            style={{width: '100%', flex: 1, borderRadius: 10}}
            source={{uri: `${url}`}}
          />
        </View>
      </View>
    </View>
  );
};
