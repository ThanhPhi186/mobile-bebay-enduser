import React, {useRef, useState} from 'react';
import useStyles from './styles';
import {View, Image, TouchableOpacity} from 'react-native';
import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import AppHeader from 'components/modules/Header';
import {HookHelper, Mixin} from 'helpers';
import ContactDetail from 'components/modules/ContactDetail';
import {TransactionInformation} from 'components/modules';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import ModalOTP from 'components/modules/ModalOTP';
import ModalPin from 'components/modules/ModalPin';
import {BottomModal} from 'components/atoms/BottomModal';
import {requestPin, requestOTP} from 'helpers/features/transfer';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {Icon} from 'react-native-elements';

export const ConfirmDetail = () => {
  const {theme, t, translations, showLoading, hideLoading} =
    HookHelper.useBaseHook();
  const {navigation, route} = useGetNavigation<'ConfirmDetail'>();
  const transferData = route.params?.transferData!;
  const balance = useAppSelector(state => state.UserReducer?.balance);
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const styles = useStyles(theme);
  const [favorite, setFavorite] = useState(false);
  const [showModalPin, setShowModalPin] = useState(false);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageOtp, setErrorMessageOtp] = useState('');
  const [errorMessageBalance, setErrorMessageBalance] = useState('');
  const [otpString, setOtpString] = useState('');

  const [showBottomModal, setShowBottomModal] = useState(false);

  const {onRequestPin} = requestPin();
  const {onRequestOTP} = requestOTP();
  const onFinish = async (pin: string) => {
    showLoading();
    try {
      const response = await onRequestPin(pin, transferData!.transId!);
      hideLoading();
      if (!response?.failed) {
        setShowModalOTP(true);
        setShowModalPin(false);
      } else {
        setTimeout(() => {
          setErrorMessage(response?.data?.message!);
        }, 200);
      }
    } catch (error) {}
  };
  const goBackHome = () => {
    navigation.navigate('TabRoute');
  };
  const onFinishOtp = async (code: string) => {
    setOtpString(code);
  };

  const onConfirm = async () => {
    showLoading();
    try {
      if (otpString) {
        const response = await onRequestOTP(
          otpString!,
          transferData!.transId!,
          favorite,
        );
        hideLoading();
        if (!response?.failed) {
          navigation.navigate('TransactionResult', {
            transactionResult: response?.data!,
          });
          setShowModalOTP(false);
        } else {
          console.log('response?.data?.code', response?.data?.code);

          if (response?.data?.code === 'ERR_OTP_ID_INVALID') {
            setTimeout(() => {
              setErrorMessageOtp(response?.data?.message!);
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
      <AppHeader filled title={t(translations.transfer.confirmDetail)} />
      <View style={styles.viewPrimary} />

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
                title={userInfo?.fullName.toUpperCase()!}
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
                title={t(translations.transfer.receiverPhone)}
                description={transferData?.receiver?.accountNumber}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.receiverName)}
                description={transferData?.receiver?.accountName}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.content)}
                description={transferData?.content || ''}
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
              <ItemTransactionDetail
                title={t(translations.transfer.fee)}
                description={transferData?.fee}
              />
              {translations.tax && (
                <ItemTransactionDetail
                  title={'Tax'}
                  description={translations.tax}
                />
              )}
            </View>
          }
        />
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
        onFinish={(code: string) => onFinishOtp(code)}
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
    </Container>
  );
};
