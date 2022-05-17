import {images} from 'assets';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import {AuthenticationType} from 'expo-local-authentication';
import {HookHelper, CurrencyHelper} from 'helpers';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Image} from 'react-native-elements';
import useStyles from './styles';
import * as LocalAuthentication from 'expo-local-authentication';
import {BiometricIcon} from 'components/modules/BiometricIcon';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {useDispatch} from 'react-redux';
import {AuthenticationActions} from 'stores/actions';
import {useLogin} from 'helpers/features/login';

const checkEnableLogin = (phoneNumber: string) => {
  if (phoneNumber.length === 8 || phoneNumber.length === 11) {
    return true;
  }
  return false;
};

export const Login = () => {
  const {theme, t, translations, dispatch} = HookHelper.useBaseHook();
  const {authentication} = HookHelper.useBiometric();
  const {navigation} = useGetNavigation();
  const {onLogin} = useLogin();
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const [accountString, setAccountString] = useState(
    authenticationReducer.accountNumber || '',
  );
  const [idImageBanner, setIdImageBanner] = useState(1);
  const styles = useStyles(theme);
  const onNext = () => {
    dispatch(AuthenticationActions.setAccountNumber.request(accountString));
    navigation.navigate('PinCode');
  };

  const onBiometric = async () => {
    const result = await authentication();
    if (result.success) {
      if (authenticationReducer.pin) {
        onLogin(authenticationReducer.pin);
      }
      // dispatch(AuthenticationActions.login.request());
    }
  };
  const getBannerImage = (id: Number) => {
    switch (id) {
      case 1:
        return images.loginBanner_1;
        break;
      case 2:
        return images.loginBanner_2;
        break;
      case 3:
        return images.loginBanner_3;
        break;
      case 4:
        return images.loginBanner_4;
        break;
      default:
        break;
    }
  };
  // useEffect(() => {
  //   setIdImageBanner(CurrencyHelper.random())
  // }, []);
  return (
    <Container scrollEnabled={false}>
      <Image
        source={getBannerImage(idImageBanner)}
        style={styles.imageBanner}
      />
      <TouchableOpacity
        onPress={() => dispatch(AuthenticationActions.skipLogin.request(true))}
        style={styles.skipContainer}>
        <AppText body1 white>
          {t(translations.login.skip)}
        </AppText>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <AppInput
          label={t(translations.login.loginInput)}
          containerStyles={styles.accountInput}
          value={accountString}
          maxLength={11}
          keyboardType="number-pad"
          onBlur={e => {
            if (accountString.length < 11) {
              setAccountString('509' + accountString);
            } else {
              setAccountString('509' + accountString.substring(3));
            }
          }}
          onChangeText={text => setAccountString(text)}
          alternative
        />
        <AppButton
          disabled={!checkEnableLogin(accountString)}
          shadow
          onPress={() => onNext()}
          title={t(translations.login.login)}
        />
        {authenticationReducer.useBiometric && (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={styles.biometricText} body1>
              {t(translations.login.biometricSignIn)}
            </AppText>
            <BiometricIcon hideName onPress={() => onBiometric()} />
          </View>
        )}
        <View
          style={[
            styles.alreadyContainer,
            !authenticationReducer.useBiometric ? {marginTop: 80} : null,
          ]}>
          <AppText body1 style={styles.alreadyAccountText}>
            {t(translations.login.alreadyAccount)}
          </AppText>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('TermsOfUse')}>
            <AppText style={styles.signUp} body1>
              {t(translations.login.signUp)}
            </AppText>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Container>
  );
};
