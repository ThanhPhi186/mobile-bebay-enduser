import React, {useRef, useState} from 'react';
import useStyles from './styles';
import {View, Image} from 'react-native';
import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import AppHeader from 'components/modules/Header';
import {HookHelper} from 'helpers';
import ContactDetail from 'components/modules/ContactDetail';
import {TransactionInformation} from 'components/modules';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import {IOTPInputRef} from 'components/modules/OtpInput';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import ModalPin from 'components/modules/ModalPin';
import ModalOTP from 'components/modules/ModalOTP';
import {useTopUp} from 'helpers/features/topUp';
import {BottomModal} from 'components/atoms/BottomModal';
import {useLoadingContext} from 'helpers/loadingHelper';

export const ConfirmTopUp = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const balance = useAppSelector(state => state.UserReducer?.balance);
  const styles = useStyles(theme);
  const {navigation, route} = useGetNavigation<'ConfirmTopUp'>();
  const {showLoading, hideLoading} = useLoadingContext();

  const checkTopUpData = route.params?.checkTopUpData!;

  const [showModalPin, setShowModalPin] = useState(false);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageOtp, setErrorMessageOtp] = useState('');
  const [otpString, setOtpString] = useState('');
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageTransaction, setErrorMessageTransaction] = useState('');
  const {onRequestPin, onRequestOTP} = useTopUp();
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const otpRef = useRef<IOTPInputRef>();
  const resend = () => {
    otpRef.current?.reset();
  };

  const onFinish = async (pin: string) => {
    try {
      showLoading();
      const response = await onRequestPin(pin, checkTopUpData.transId!);
      hideLoading();
      if (!response?.failed) {
        setShowModalPin(false);
        setShowModalOTP(true);
      } else {
        setTimeout(() => {
          setErrorMessage(response?.data?.message!);
        }, 200);
      }
    } catch (error) {}
  };

  const onConfirm = async () => {
    try {
      if (otpString) {
        const response = await onRequestOTP(otpString, checkTopUpData.transId!);
        if (!response?.failed) {
          setShowModalOTP(false);
          navigation.navigate('TopUpResult', {topUpResult: response?.data!});
        } else {
          if (response?.data?.code === 'ERR_OTP_ID_INVALID') {
            setTimeout(() => {
              setErrorMessageOtp(response?.data?.message!);
            }, 200);
          } else {
            setShowModalOTP(false);
            setShowBottomModal(true);
            setErrorMessageTransaction(response?.data?.message!);
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
                title={userInfo?.fullName!}
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
                title={t(translations.data.provider)}
                description={'Natcash'}
              />
              <ItemTransactionDetail
                title={t(translations.topUp.receiverPhone)}
                description={checkTopUpData.receiversPhone}
              />
              <View style={[styles.titleContainer, {marginTop: 16}]}>
                <AppText style={styles.txtTitle}>
                  {t(translations.topUp.paymentDetails)}
                </AppText>
              </View>
              <ItemTransactionDetail
                title={t(translations.transfer.amountPayment)}
                description={checkTopUpData.amount}
              />
              {checkTopUpData.discount ? (
                <ItemTransactionDetail
                  title={t(translations.data.discount)}
                  description={checkTopUpData.discount}
                />
              ) : null}
              {checkTopUpData.fee ? (
                <ItemTransactionDetail
                  title={t(translations.transfer.fee)}
                  description={checkTopUpData.fee}
                />
              ) : null}
              {checkTopUpData.tax && (
                <ItemTransactionDetail
                  title={t(translations.topUp.tax)}
                  description={checkTopUpData.tax}
                />
              )}

              <View style={[styles.titleContainer, {marginTop: 16}]}>
                <AppText style={styles.txtTitle}>
                  {t(translations.topUp.promotionDetails)}
                </AppText>
              </View>
              {checkTopUpData.amountToNatCom && (
                <ItemTransactionDetail
                  title={t(translations.topUp.amountToNatcomBasicAccount)}
                  description={checkTopUpData.amountToNatCom}
                />
              )}
              {checkTopUpData.amountToNatComPromotion && (
                <ItemTransactionDetail
                  title={t(translations.topUp.amountToNatcomPromotionalAccount)}
                  description={checkTopUpData.amountToNatComPromotion}
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
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageTransaction}</AppText>
        </View>
      </BottomModal>
      <View style={styles.viewPrimary} />
    </Container>
  );
};
