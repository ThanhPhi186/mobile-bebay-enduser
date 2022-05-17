import React, {useRef, useState, useEffect} from 'react';
import useStyles from './styles';
import {Alert, View, Image, TouchableOpacity} from 'react-native';
import {images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import {useDispatch} from 'react-redux';
import AppHeader from 'components/modules/Header';
import {AuthenticationActions} from 'stores/actions';
import {HookHelper, Mixin} from 'helpers';
import ContactDetail from 'components/modules/ContactDetail';
import {TransactionInformation} from 'components/modules';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import {IOTPInputRef, OTPInput} from 'components/modules/OtpInput';
import ModalOTP from 'components/modules/ModalOTP';
import ModalPin from 'components/modules/ModalPin';
import {BottomModal} from 'components/atoms/BottomModal';
import {requestPin, requestOTP} from 'helpers/features/transfer';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {useBill} from 'helpers/features/bill';
import {ErrorModal} from 'components/modules/ErrorModal';

export const BillDetail = () => {
  const {theme, t, translations, showLoading, hideLoading} =
    HookHelper.useBaseHook();
  const {navigation, route} = useGetNavigation();
  const transferData = route.params?.transferData;

  const balance = useAppSelector(state => state.UserReducer?.balance);

  const styles = useStyles(theme);
  const disPatch = useDispatch();
  const [showModalPin, setShowModalPin] = useState(false);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageOtp, setErrorMessageOtp] = useState('');
  const [errorMessageBalance, setErrorMessageBalance] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<{title: string; description?: string}>();

  const [showBottomModal, setShowBottomModal] = useState(false);
  const {onRequestPin, onRequestOTP} = useBill();
  const [otp, setOtp] = useState('');
  const otpRef = useRef<IOTPInputRef>();
  const [deactiveOther, setDeactiveOther] = useState(false);
  const resend = () => {
    otpRef.current?.reset();
  };
  useEffect(() => {
    // onCheckBill()
  }, []);
  const onFinish = async (pin: string) => {
    // navigation.navigate('TransactionResult', {
    //   transactionResult: '',
    // });
    showLoading();
    try {
      const response = await onRequestPin(pin, transferData.transId);
      hideLoading();
      if (!response?.failed) {
        setShowModalOTP(true);
        setShowModalPin(false);
      } else {
        setTimeout(() => {
          setErrorMessage(response?.data?.message);
        }, 200);
      }
    } catch (error) {}
  };
  const goBackHome = () => {
    navigation.navigate('TabRoute');
  };
  const tryAgain = () => {
    setShowError(false);
    setError(undefined);
  };

  const onConfirm = async () => {
    showLoading();
    try {
      if (otp) {
        const response = await onRequestOTP(otp!, transferData.transId);
        hideLoading();
        if (!response?.failed) {
          navigation.navigate('PaymentResult', {
            transactionResult: response?.data,
          });
          setShowModalOTP(false);
        } else {
          if (response?.data?.code === 'ERR_OTP_ID_INVALID') {
            setTimeout(() => {
              setErrorMessageOtp(response?.data?.message);
            }, 200);
          } else {
            setShowBottomModal(true);
            setShowModalOTP(false);
            setErrorMessageBalance(response?.data?.message);
          }
        }
      } else {
        hideLoading();
        setTimeout(() => {
          setErrorMessageOtp(t(translations.OTPInvalid));
        }, 200);
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
      <AppHeader filled title={t(translations.paymentService.natcashBill)} />
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
                // rightButton
                title={t(translations.data.natCashAccount)}
                description={`${balance} HTG`}
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
                title={t(translations.paymentService.service)}
                description={transferData?.service}
              />
              <ItemTransactionDetail
                title={t(translations.data.provider)}
                description={transferData?.provider}
              />
              <ItemTransactionDetail
                title={t(translations.paymentService.customerName)}
                description={transferData?.customerName || ''}
              />
              <ItemTransactionDetail
                title={t(translations.paymentService.customerNumber)}
                description={transferData?.customerNumber || ''}
              />
              <View style={styles.titleContainer}>
                <AppText style={styles.txtTitle}>
                  {t(translations.transfer.paymentDetail)}
                </AppText>
              </View>
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={transferData?.amount}
              />
              {/* <ItemTransactionDetail
                title={t(translations.paymentService.discount)}
                description={transferData?.discount}
              /> */}
              {transferData?.fee ? (
                <ItemTransactionDetail
                  title={t(translations.transfer.fee)}
                  description={transferData?.fee}
                />
              ) : null}
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
        onPressClose={() => onCancel()}
        showModal={showModalPin}
        errorMessage={errorMessage}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        onFinish={code => onFinish(code)}
        canCancel={true}
      />
      <ModalOTP
        onConfirm={() => onConfirm()}
        onCancel={() => onCancel()}
        errorMessage={errorMessageOtp}
        showModal={showModalOTP}
        onFinish={(code: string) => setOtp(code)}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        canCancel={true}
      />
      <BottomModal
        onConfirm={() => navigation.goBack()}
        onCancel={() => goBackHome()}
        isVisible={showBottomModal}
        cancelTitle={t(translations.transfer.backToHome)}
        confirmTitle={t(translations.transfer.transactionAgain)}
        canCancel>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageBalance}</AppText>
        </View>
      </BottomModal>
      <ErrorModal
        confirmTitle={t(translations.changePin.tryAgain)}
        onConfirm={() => tryAgain()}
        isVisible={showError}
        title={error?.title || ''}
        description={error?.description}
      />
    </Container>
  );
};
