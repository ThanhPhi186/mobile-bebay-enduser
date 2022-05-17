import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import { HookHelper } from 'helpers';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import useStyles from './styles';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import RegisterHeader from '../component/Header';
import ModalOTP from 'components/modules/ModalOTP';

export const ConfirmRegister = () => {
  const { theme, t, translations, dispatch } = HookHelper.useBaseHook();
  const { navigation, route } = useGetNavigation();
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [errorMessageOtp, setErrorMessageOtp] = useState('');

  const [pin, setPin] = useState('');

  const styles = useStyles(theme);
  const onRegister = () => {
    setShowModalOTP(true)
  }
  const onConfirm = () => {

  }
  const onCancel = () => {
  }
  useEffect(() => {
  }, []);
  return (
    <Container scrollEnabled={false}>
      <RegisterHeader filled title={t(translations.register.termsOfUse)} />
      <View style={styles.container}>
        <AppInput
          label={t(translations.register.referenceNumber)}
          containerStyles={styles.accountInput}
          value={referenceNumber}
          alternative
          keyboardType="number-pad"
          onChangeText={text => setReferenceNumber(text)}
        />
        <AppInput
          label={t(translations.register.PIN)}
          containerStyles={styles.accountInput}
          value={pin}
          alternative
          keyboardType="default"
          onChangeText={text => setPin(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <AppButton
          disabled={referenceNumber.length < 5}
          shadow
          onPress={() => onRegister()}
          title={t(translations.register.agreeAndContinue)} />
      </View>
      <ModalOTP
        onConfirm={() => onConfirm()}
        onCancel={() => onCancel()}
        errorMessage={errorMessageOtp}
        showModal={showModalOTP}
        onFinish={(code: string) => onConfirm()}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        canCancel={true}
      />
    </Container >
  );
};
