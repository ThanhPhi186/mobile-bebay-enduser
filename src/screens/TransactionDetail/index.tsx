import React, { useRef, useState, useEffect } from 'react';
import useStyles from './styles';
import { View, Image } from 'react-native';
import { images } from 'assets';
import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import AppHeader from 'components/modules/Header';
import { HookHelper } from 'helpers';
import HeaderTransactionDetail from './HeaderTransactionDetail';
import { TransactionInformation } from 'components/modules';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import { IOTPInputRef } from 'components/modules/OtpInput';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import ModalPin from 'components/modules/ModalPin';
import ModalOTP from 'components/modules/ModalOTP';
import { useTopUp } from 'helpers/features/topUp';
import { BottomModal } from 'components/atoms/BottomModal';
import { useLoadingContext } from 'helpers/loadingHelper';
import { useTransaction } from 'helpers/features/transaction';
import { ITransactionDetailResponse } from 'models/services/ITransaction';

export const TransactionDetail = () => {
  const { theme, t, translations } = HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const { navigation, route } = useGetNavigation<'TransactionDetail'>();
  const { onGetTransactionService, onGetListTransaction, onGetTransactionDetail } = useTransaction();
  const [dataTransactionDetail, setDataTransactionDetail] = useState<ITransactionDetailResponse>();

  const { showLoading, hideLoading } = useLoadingContext();
  const dataTransaction = route?.params?.dataTransaction;
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const getTransactionDetail = async () => {
    showLoading();
    const result = await onGetTransactionDetail(dataTransaction?.transactionId);
    hideLoading();
    setDataTransactionDetail(result?.data.transactionDetail)
  };

  useEffect(() => {
    getTransactionDetail();
  }, []);
  const getIcon = (type: string) => {
    switch (type) {
      case "1":
        return images.icon_transaction;
      case "2":
        return images.IconWithdraw;
      case "3":
        return images.iconData;
      case "4":
        return images.IconTopUp;
      case "5":
        return images.iconServicePayment;
      default:
        return images.icon_transaction;
    }
  };
  return (
    <Container scrollEnabled={true}>
      <AppHeader filled title={t(translations.transfer.transactionDetail)} />
      <View style={styles.inputContainer}>
        <TransactionInformation
          disableCollapsible
          renderHeader={
            <View style={{ width: '100%' }}>
              <HeaderTransactionDetail
                title={dataTransactionDetail?.transactionName || ''}
                description={dataTransactionDetail?.transactionId || ''}
                amount={dataTransactionDetail?.amount || ''}
                icon={getIcon(dataTransactionDetail?.transType)}
              />
            </View>
          }
          renderBody={
            <View style={{ width: '100%' }}>
              <View style={styles.titleContainer}>
                <AppText style={styles.txtTitle}>
                  {t(translations.transfer.transactionDetails)}
                </AppText>
              </View>
              {dataTransactionDetail?.createDateString ? <ItemTransactionDetail
                title={t(translations.withdraw.transactionTimes)}
                description={dataTransactionDetail?.createDateString}
              /> : null}
              {dataTransactionDetail?.fullName ? <ItemTransactionDetail
                title={dataTransactionDetail?.amount.includes('+') ? t(translations.transfer.senderName) : t(translations.transfer.receiverName)}
                description={dataTransactionDetail?.fullName}
              /> : null}
              {dataTransactionDetail?.accountNumber ? <ItemTransactionDetail
                title={dataTransactionDetail?.amount.includes('+') ? t(translations.transfer.SenderAccount) : t(translations.topUp.receiverPhone)}
                description={dataTransactionDetail?.accountNumber}
              /> : null}
              {dataTransactionDetail?.service ? <ItemTransactionDetail
                title={t(translations.paymentService.service)}
                description={dataTransactionDetail?.service}
              /> : null}
              {dataTransactionDetail?.provider ? <ItemTransactionDetail
                title={t(translations.data.provider)}
                description={dataTransactionDetail?.provider}
              /> : null}
              {dataTransactionDetail?.content ? <ItemTransactionDetail
                title={t(translations.transfer.content)}
                description={dataTransactionDetail?.content}
              /> : null}
              <View style={[styles.titleContainer, { marginTop: 16 }]}>
                <AppText style={styles.txtTitle}>
                  {t(translations.topUp.paymentDetails)}
                </AppText>
              </View>
              {dataTransactionDetail?.amountDetail ? <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={dataTransactionDetail?.amountDetail}
              /> : null}
              {dataTransactionDetail?.tax && dataTransactionDetail?.amount.includes('-') ? <ItemTransactionDetail
                title={t(translations.topUp.tax)}
                description={dataTransactionDetail?.tax}
              /> : null}

              {dataTransactionDetail?.totalAmount && dataTransactionDetail?.amount.includes('-') ? <ItemTransactionDetail
                title={t(translations.topUp.totalAmount)}
                description={`${dataTransactionDetail?.totalAmount} HTG`}
              /> : null}
            </View>
          }
        >
        </TransactionInformation>
      </View>
      {/* <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => setShowModalPin(true)}
          shadow
          title={t(translations.transfer.continue)}
        />
      </View> */}
      <View style={styles.viewPrimary} />
    </Container>
  );
};
