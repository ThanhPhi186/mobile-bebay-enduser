import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import RegisterHeader from '../component/Header';
import { BottomModal } from 'components/atoms/BottomModal';
import Container from 'components/atoms/Container';
import { HookHelper } from 'helpers';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import useStyles from './styles';
import { useRegister } from 'helpers/features/register';
import { ErrorModal } from 'components/modules/ErrorModal';
import { validatePhoneNumber } from 'helpers/stringHelper';
import { images } from 'assets';
import { useGetNavigation } from 'helpers/hookHelper';
import {WebView} from 'react-native-webview';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';

export const TermsOfUse = () => {
  const { theme, t, translations, dispatch, showLoading, hideLoading } = HookHelper.useBaseHook();
  const { navigation } = useGetNavigation();
  const styles = useStyles(theme);

  const [accountString, setAccountString] = useState('');
  const { onCheckAccountPhone } = useRegister();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<{ title: string; description?: string }>();
  const appConfig = useAppSelector(state => state.AppReducer.appConfig);
  const language = useAppSelector(state => state.LanguageReducer.language);
  const url = appConfig[`termofuse_url_${language}`];
  const onRegister = async () => {
    showLoading();
    const result = await onCheckAccountPhone(accountString);
    if (result?.succeeded && !result.failed) {
      navigation.navigate('Register', { phoneNumber: accountString, transId: result?.data?.transId });
    } else {
      setError({
        title: t(translations.error),
        description: result?.data?.message,
      });
      setShowError(true);
    }
  };

  const tryAgain = () => {
    setShowError(false);
    setError(undefined);
  };
  return (
    <View style={{flex:1}}>
      <View style={styles.container}>
        <RegisterHeader title={t(translations.register.title)} />
        
         <WebView
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            originWhitelist={['*']}
            style={{width: '100%', flex: 1, borderRadius: 5, backgroundColor:'#00659F'}}
            source={{uri: `${url}`}}
          />
          <View style={{height:50, width:'100%', backgroundColor:'transparent'}}></View>
      </View>
      <View style={styles.inputContainer}>
        <AppInput
          label={t(translations.transfer.phoneNumber)}
          containerStyles={styles.accountInput}
          value={accountString}
          alternative
          keyboardType="number-pad"
          onBlur={e => {
            if (accountString.length < 11) {
              setAccountString('509' + accountString)
            } else {
              setAccountString('509' + accountString.substring(3))
            }
          }}
          onChangeText={text => setAccountString(text)}
        />
        <AppButton
          disabled={!validatePhoneNumber(accountString)}
          shadow
          onPress={() => onRegister()}
          title={t(translations.register.agreeAndContinue)}
        />
      </View>
      <ErrorModal
        confirmTitle={t(translations.changePin.tryAgain)}
        onConfirm={() => tryAgain()}
        isVisible={showError}
        title={error?.title || ''}
        description={error?.description}
      />
    </View>
  );
};
