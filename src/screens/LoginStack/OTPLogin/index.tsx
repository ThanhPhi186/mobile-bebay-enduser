import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import {AppCheckBox} from 'components/modules/AppCheckBox';
import AppHeader from 'components/modules/Header';
import {HelloLogin} from 'components/modules/HelloLogin';
import {IOTPInputRef, OTPInput} from 'components/modules/OtpInput';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import useStyles from './styles';
import {useDispatch} from 'react-redux';
import {AuthenticationActions} from 'stores/actions';
import {EncryptHelper} from 'helpers';
import {ILoginOTPRequest, ILoginRequest} from 'models/services/ILogin';
import AuthenticationServices from 'services/AuthenticationServices';
import {ErrorMessage} from 'components/modules/ErrorMessage';
import _ from 'lodash';
import {Keyboard} from 'react-native';
import {useLoadingContext} from 'helpers/loadingHelper';

export const OTPLogin = () => {
  const {t, translations, theme} = useBaseHook();
  const {route} = useGetNavigation<'OTPLogin'>();
  const disPatch = useDispatch();
  const {showLoading, hideLoading} = useLoadingContext();
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const otpRef = useRef<IOTPInputRef>();
  const styles = useStyles(theme);
  const [deactiveOthersDevice, setdeactiveOthersDevice] = useState(false);
  const [transId, setTransId] = useState<string>(route.params?.transId || '');
  const [errorMessage, setErrorMessage] = useState<string>();
  const resend = async () => {
    showLoading();
    const text = `${authenticationReducer.accountNumber}${route.params?.pin!}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ILoginRequest = {
      signature,
      pin: route.params?.pin!,
      accountNumber: authenticationReducer.accountNumber!,
    };
    const loginResponse = await AuthenticationServices.login(params);
    setErrorMessage(undefined);
    hideLoading();
    if (
      !loginResponse.failed &&
      loginResponse.succeeded &&
      loginResponse.data
    ) {
      otpRef.current?.reset();
      setTransId(loginResponse.data.transId || '');
    }
  };
  const onFinish = (otp: string) => {
    onLogin(otp);
    // disPatch(AuthenticationActions.login.request());
  };
  const onLogin = async (otp: string) => {
    showLoading();
    const signature = await EncryptHelper.encryptSha256(
      `${transId}${otp}`,
      authenticationReducer.signatureKey!,
    );
    const data: ILoginOTPRequest = {
      signature,
      transId,
      otp,
      deactiveOthersDevice: deactiveOthersDevice ? 1 : 0,
    };
    const response = await AuthenticationServices.loginOtp(data);
    hideLoading();
    if (!response.failed && response?.succeeded && response?.data) {
      const accessTokenOrigin = await EncryptHelper.decryptString(
        response.data.accessToken!,
        authenticationReducer.rsaPrivateKey!,
      );
      const loginToken = await EncryptHelper.encryptString(
        accessTokenOrigin,
        authenticationReducer.rsaPublicKey!,
      );
      disPatch(
        AuthenticationActions.setAuthenticationData.request({
          ...response.data,
          loginToken,
          pin: route.params?.pin,
        }),
      );
    } else {
      setErrorMessage(response.data?.message);
      Keyboard.dismiss();
      setTimeout(() => {
        otpRef.current?.clear();
      });
    }
  };
  return (
    <Container scrollEnabled={false}>
      <AppHeader title={t(translations.otp.verificationCode)} />
      <View style={styles.container}>
        <HelloLogin description={t(translations.otp.firstTimeOtp)} />
        <OTPInput
          ref={ref => {
            if (ref) {
              otpRef.current = ref;
            }
          }}
          hideResend={true}
          // transId={route.params?.transId!}
          onFinish={onFinish}
        />
        <TouchableOpacity onPress={() => resend()}>
          <AppText subtitle2 style={styles.resend}>
            {t(translations.otp.resend)}
          </AppText>
        </TouchableOpacity>
        {errorMessage && !_.isEmpty(errorMessage) ? (
          <ErrorMessage
            errorStyle={{marginTop: 32}}
            message={errorMessage}
            protected
          />
        ) : null}
      </View>
      <View style={styles.deactiveContainer}>
        <TouchableWithoutFeedback
          onPress={() => setdeactiveOthersDevice(!deactiveOthersDevice)}>
          <AppCheckBox
            checked={deactiveOthersDevice}
            onPress={() => setdeactiveOthersDevice(!deactiveOthersDevice)}
            title={t(translations.otp.deActiveOther)}
          />
        </TouchableWithoutFeedback>
      </View>
    </Container>
  );
};
