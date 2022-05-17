import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import ContactDetail from 'components/modules/ContactDetail';
import AppHeader from 'components/modules/Header';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import ModalOTP from 'components/modules/ModalOTP';
import ModalPin from 'components/modules/ModalPin';
import {IOTPInputRef} from 'components/modules/OtpInput';
import {TransactionInformation} from 'components/modules';
import {HookHelper} from 'helpers';
import {useWithdraw} from 'helpers/features/withdraw';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import React, {useRef, useState} from 'react';
import {Image, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import styles from './styles';
import {BottomModal} from 'components/atoms/BottomModal';
import {images} from 'assets';
import {useLoadingContext} from 'helpers/loadingHelper';

export const ConfirmWithdraw = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const balance = useAppSelector(state => state.UserReducer?.balance);

  const {navigation, route} = useGetNavigation<'ConfirmWithdraw'>();
  const {withdrawInfo, agentCode} = route?.params!;
  const {showLoading, hideLoading} = useLoadingContext();
  const [showModalPin, setShowModalPin] = useState(false);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageOtp, setErrorMessageOtp] = useState('');
  const [otpString, setOtpString] = useState('');
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageBottom, setErrorMessageBottom] = useState('');

  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const {onRequestPin, onRequestOTP} = useWithdraw();

  const otpRef = useRef<IOTPInputRef>();
  const resend = () => {
    otpRef.current?.reset();
  };

  const onFinish = async (pin: string) => {
    try {
      showLoading();
      const response = await onRequestPin(withdrawInfo.transId!, pin);
      hideLoading();
      if (!response?.failed) {
        setShowModalPin(false);
        setShowModalOTP(true);
      } else {
        setTimeout(() => {
          setErrorMessage(`${response?.data?.message}`);
        }, 200);
      }
    } catch (error) {}
  };

  const onConfirm = async () => {
    try {
      if (otpString) {
        showLoading();
        const response = await onRequestOTP(withdrawInfo.transId!, otpString);
        // setShowModalOTP(false);
        hideLoading();
        if (!response?.failed) {
          setShowModalOTP(false);
          navigation.navigate('WithdrawResult', {
            withdrawResult: response?.data!,
          });
        } else {
          if (response?.data?.code === 'ERR_OTP_ID_INVALID') {
            setErrorMessageOtp(response?.data?.message!);
          } else {
            setShowModalOTP(false);
            setErrorMessageBottom(response?.data?.message || '');
            setShowBottomModal(true);
          }
        }
      } else {
        hideLoading();
        setErrorMessageOtp(t(translations.OTPInvalid));
      }
    } catch (error) {}
  };

  const onCancel = () => {
    setErrorMessage('');
    setErrorMessageOtp('');
    setShowModalOTP(false);
    setShowModalPin(false);
  };
  return (
    <Container scrollEnabled={true}>
      <AppHeader filled title={t(translations.transfer.confirmDetail)} />
      <View style={styles.inputContainer}>
        <TransactionInformation
          disableCollapsible
          renderHeader={
            <View style={{width: '100%'}}>
              <View style={styles.titleContainer}>
                <AppText style={styles.txtTitle}>
                  {t(translations.transfer.sourceAccount)}
                </AppText>
              </View>
              <ContactDetail
                // title={t(translations.data.natCashAccount)}
                title={userInfo?.fullName!}
                description={`${balance || ''} HTG`}
              />
            </View>
          }
          renderBody={
            <View style={{width: '100%'}}>
              <View style={styles.titleContainer}>
                <AppText style={styles.txtTitle}>
                  {t(translations.transfer.transactionDetails)}
                </AppText>
              </View>
              <ItemTransactionDetail
                title={t(translations.withdraw.agentCode)}
                description={agentCode}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.agentPhone)}
                description={withdrawInfo?.phoneNumberAgent}
              />
              <View style={[styles.titleContainer, {marginTop: 10}]}>
                <AppText style={styles.txtTitle}>
                  {t(translations.topUp.paymentDetails)}
                </AppText>
              </View>
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={withdrawInfo.amount}
              />
              {withdrawInfo.discount ? (
                <ItemTransactionDetail
                  title={t(translations.data.discount)}
                  description={withdrawInfo.discount}
                />
              ) : null}
              {withdrawInfo.fee ? (
                <ItemTransactionDetail
                  title={t(translations.transfer.fee)}
                  description={withdrawInfo.fee}
                />
              ) : null}
              {withdrawInfo.tax && (
                <ItemTransactionDetail
                  title={t(translations.topUp.tax)}
                  description={withdrawInfo.tax}
                />
              )}
            </View>
          }></TransactionInformation>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => setShowModalPin(true)}
          shadow
          title={t(translations.transfer.continue)}
        />
      </View>
      <ModalPin
        onConfirm={() => onConfirm()}
        onCancel={() => onCancel()}
        showModal={showModalPin}
        errorMessage={errorMessage}
        onPressClose={() => onCancel()}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        onFinish={code => onFinish(code)}
        canCancel={true}
      />
      <ModalOTP
        onConfirm={() => onConfirm()}
        onCancel={() => onCancel()}
        showModal={showModalOTP}
        errorMessage={errorMessageOtp}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        onFinish={(code: string) => setOtpString(code)}
        canCancel={true}
      />
      <View style={styles.viewPrimary} />
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageBottom}</AppText>
        </View>
      </BottomModal>
    </Container>
  );
};
