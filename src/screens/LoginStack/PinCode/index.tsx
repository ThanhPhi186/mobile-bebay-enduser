import React, {useRef, useEffect, useState} from 'react';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import {View, Keyboard} from 'react-native';
import {PinCodeInput} from 'components/modules/PinCodeInput';
import useStyles from './styles';
import {OtpInputsRef} from 'react-native-otp-inputs';
import {HelloLogin} from 'components/modules/HelloLogin';
import {ErrorMessage} from 'components/modules/ErrorMessage';
import {useLogin} from 'helpers/features/login';
import _ from 'lodash';

export const PinCode = () => {
  const {theme, t, translations} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  const {onLogin} = useLogin();
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinInputRef = useRef<OtpInputsRef>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetPin();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  const resetPin = () => {
    pinInputRef.current?.reset();
    setTimeout(() => {
      pinInputRef.current?.focus();
    }, 100);
  };
  const onFinishPin = (code: string) => {
    setTimeout(() => {
      pinInputRef.current?.reset();
    }, 200);
    Keyboard.dismiss();
    onLogin(code, errorMessage => {
      setErrorMessage(errorMessage);
      resetPin();
    });
    return;
  };
  return (
    <Container scrollEnabled={false}>
      <AppHeader filled title={t(translations.pinCode.pinCode)} />
      <View style={styles.container}>
        <HelloLogin description={t(translations.pinCode.pinText)} />
        <PinCodeInput
          ref={ref => {
            if (ref) {
              pinInputRef.current = ref;
            }
          }}
          onFinish={code => onFinishPin(code)}
        />
        {errorMessage && !_.isEmpty(errorMessage) ? (
          <ErrorMessage
            errorStyle={{marginTop: 32}}
            message={errorMessage}
            protected
          />
        ) : null}
      </View>
    </Container>
  );
};
