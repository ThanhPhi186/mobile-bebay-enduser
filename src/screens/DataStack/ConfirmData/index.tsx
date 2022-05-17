import React, {useState} from 'react';

import AppHeader from 'components/modules/Header';
import {HookHelper} from 'helpers';
import Container from 'components/atoms/Container';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {View, Image} from 'react-native';
import {TransactionInformation} from 'components/modules';
import AppText from 'components/atoms/AppText';
import ContactDetail from 'components/modules/ContactDetail';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import AppButton from 'components/atoms/Button';
import useStyles from './styles';
import {device_height} from 'helpers/Mixin';
import ModalPin from 'components/modules/ModalPin';
import ModalOTP from 'components/modules/ModalOTP';
import SimpleToast from 'react-native-simple-toast';
import {useData} from 'helpers/features/data';
import {BottomModal} from 'components/atoms/BottomModal';
import {images} from 'assets';
import {useLoadingContext} from 'helpers/loadingHelper';
export const ConfirmData = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const balance = useAppSelector(state => state.UserReducer?.balance);
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const styles = useStyles(theme);
  const {navigation, route} = useGetNavigation<'ConfirmData'>();

  const {onRequestPin, onRequestOTP} = useData();

  const {dataInfo, receiversPhone} = route?.params!;
  const {showLoading, hideLoading} = useLoadingContext();

  const [showModalPin, setShowModalPin] = useState(false);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageOtp, setErrorMessageOtp] = useState('');
  const [otpString, setOtpString] = useState('');
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageBalance, setErrorMessageBalance] = useState('');

  const onFinish = async (pin: string) => {
    try {
      showLoading();
      const response = await onRequestPin(dataInfo.transId!, pin);
      hideLoading();
      if (!response?.failed) {
        setShowModalPin(false);
        setShowModalOTP(true);
      } else {
        setErrorMessage(response?.data?.message!);
      }
    } catch (error) {}
  };

  const confirmData = async () => {
    try {
      if (otpString) {
        showLoading();
        const response = await onRequestOTP(
          dataInfo.transId!,
          otpString,
          receiversPhone,
        );
        hideLoading();
        if (!response?.failed) {
          setShowModalOTP(false);
          navigation.navigate('DataResult', {
            dataResult: response?.data!,
          });
        } else {
          if (response?.data?.code === 'ERR_OTP_ID_INVALID') {
            setErrorMessageOtp(response?.data?.message!);
          } else {
            setShowModalOTP(false);
            setErrorMessageBalance(response?.data?.message || '');
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
                description={receiversPhone}
              />
              <ItemTransactionDetail
                title={t(translations.data.packageName)}
                description={dataInfo.packageName}
              />
              <View style={[styles.titleContainer, {marginTop: 16}]}>
                <AppText style={styles.txtTitle}>
                  {t(translations.transfer.paymentDetail)}
                </AppText>
              </View>
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={dataInfo.amount}
              />
              {dataInfo.discount ? (
                <ItemTransactionDetail
                  title={t(translations.data.discount)}
                  description={dataInfo.discount}
                />
              ) : null}
              {dataInfo.fee ? (
                <ItemTransactionDetail
                  title={t(translations.transfer.fee)}
                  description={dataInfo.fee}
                />
              ) : null}
              {dataInfo.tax && (
                <ItemTransactionDetail
                  title={t(translations.topUp.tax)}
                  description={dataInfo.tax}
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
      <View style={styles.viewPrimary} />
      <ModalPin
        onConfirm={() => confirmData()}
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
        onConfirm={() => confirmData()}
        onCancel={() => onCancel()}
        showModal={showModalOTP}
        errorMessage={errorMessageOtp}
        onFinish={(code: string) => setOtpString(code)}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        canCancel={true}
      />
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageBalance}</AppText>
        </View>
      </BottomModal>
    </Container>
  );
};
