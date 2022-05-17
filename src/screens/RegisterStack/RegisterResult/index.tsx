import { images } from 'assets';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import RegisterHeader from '../component/Header';
import { BottomModal } from 'components/atoms/BottomModal';
import Container from 'components/atoms/Container';
import { AuthenticationType } from 'expo-local-authentication';
import { HookHelper } from 'helpers';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Image } from 'react-native-elements';
import useStyles from './styles';
import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricIcon } from 'components/modules/BiometricIcon';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import { useDispatch } from 'react-redux';
import { AuthenticationActions } from 'stores/actions';
import { useRegister } from 'helpers/features/register';
import UpgradeGold from '../component/UpgradeGold'
export const RegisterResult = () => {
  const { theme, t, translations, dispatch } = HookHelper.useBaseHook();
  const { navigation } = useGetNavigation();

  const { authentication } = HookHelper.useBiometric();
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const [showModal, setShowModal] = useState(false);
  const [accountString, setAccountString] = useState('');
  const { onCheckAccountPhone } = useRegister();


  const styles = useStyles(theme);
  const onRegister = () => {
    navigation.navigate('RegisterResult');
  };
  return (
    <Container scrollEnabled={false}>
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={images.IconCheck} />
        <AppText style={styles.txtTitle}>{'Register account success'}</AppText>
        <AppText body2>{'Please login to use services'}</AppText>
        <UpgradeGold onRightButton ={() => navigation.navigate('login')}/>
      </View>

      <View style={styles.inputContainer}>
        <AppButton
          shadow
          onPress={() => navigation.navigate('Login')}
          title={t(translations.login.login)}
        />
        <AppButton
          shadow
          filled
          onPress={() => dispatch(AuthenticationActions.skipLogin.request(true))}
          title={t(translations.transfer.backToHome)}
        />
      </View>

    </Container>
  );
};
