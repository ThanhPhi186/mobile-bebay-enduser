import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import {CurrencyHelper} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import {IBillResponse} from 'models/services/IBill';
import React, {useState} from 'react';
import {View} from 'react-native';
import SelectPaymentService from '../Bill/component/SelectPaymentService';
import useStyles from './styles';
import ValidateRegex from 'models/EValidateRegex';
import {useLoadingContext} from 'helpers/loadingHelper';
import {useBill} from 'helpers/features/bill';
import {ErrorModal} from 'components/modules/ErrorModal';
import {BILL_TYPE} from 'models/EBillType';
export const BillDebit = () => {
  const {t, translations, theme} = useBaseHook();
  const styles = useStyles(theme);
  const {route, navigation} = useGetNavigation<'BillDebit'>();
  const {showLoading, hideLoading} = useLoadingContext();
  const data = route.params?.transferData;
  console.log('WWEWE', data);

  const {onCheckBill} = useBill();
  const [error, setError] = useState<{title: string; description?: string}>();
  const [showError, setShowError] = useState(false);
  const billType = route.params?.type;
  const [htg, setHtg] = useState<string>(
    CurrencyHelper.formatAmount(
      `${data?.debitAmountHTG || ''}`.replace(/\,/g, ''),
    ),
  );
  const [usd, setUsd] = useState<string>(
    CurrencyHelper.formatAmount(
      `${data?.debitAmountUSD || ''}`.replace(/\,/g, ''),
    ),
  );
  const getTitleByBillType = () => {
    switch (billType) {
      case BILL_TYPE.INTERNET:
        return t(translations.paymentService.internetBill);
      default:
        return t(translations.paymentService.postPaidBill);
    }
  };
  const getHeaderByBillType = () => {
    switch (billType) {
      case BILL_TYPE.INTERNET:
        return t(translations.paymentService.natcomInternet);
      default:
        return t(translations.paymentService.natcomPostPaid);
    }
  };

  const onHtgChange = (amount: string) => {
    let numberAmount = amount.replace(ValidateRegex.REMOVE_FIRST_ZERO, '');
    setHtg(CurrencyHelper.formatAmount(numberAmount.replace(/\,/g, '')));
    const htgNumber = Number(numberAmount.replace(/\,/g, ''));
    const usdNumber = htgNumber / Number(data?.exchangeRate || 1);
    setUsd(CurrencyHelper.formatAmount(`${usdNumber}`.replace(/\,/g, '')));
  };
  const onUsdChange = (amount: string) => {
    let numberAmount = amount.replace(ValidateRegex.REMOVE_FIRST_ZERO, '');
    setUsd(CurrencyHelper.formatAmount(numberAmount.replace(/\,/g, '')));
    const usdNumber = Number(numberAmount.replace(/\,/g, ''));
    const htgNumber = usdNumber * Number(data?.exchangeRate || 1);
    setHtg(CurrencyHelper.formatAmount(`${htgNumber}`.replace(/\,/g, '')));
  };
  const tryAgain = () => {
    setShowError(false);
    setError(undefined);
  };
  const onContinue = async () => {
    showLoading();
    const result = await onCheckBill(
      data?.receiversPhone || '',
      `${CurrencyHelper.formatPrice(Number((htg || '').replace(/\,/g, '')))}`,
      data?.transId || '',
    );
    hideLoading();
    if (result?.succeeded && !result.failed) {
      navigation.navigate('BillDetail', {transferData: result?.data});
    } else {
      setError({
        title: t(translations.error),
        description: result?.data?.message,
      });
      setShowError(true);
    }
  };

  return (
    <>
      <AppHeader filled title={getHeaderByBillType()} />
      <Container scrollEnabled={true}>
        <SelectPaymentService
          isContact
          title={t(translations.paymentService.natcashBillPayment)}
          description={getTitleByBillType()}
        />
        <View style={styles.bottomView} />
        <View style={styles.container}>
          <AppInput
            disabledLabel
            editable={false}
            // isClear
            value={data?.receiversPhone}
            label={t(translations.paymentService.billDebit.invoiceNumber)}
          />
          <AppInput
            containerStyles={{marginVertical: 16}}
            label={`${t(translations.transfer.amountField)} (${t(
              translations.HTG,
            )})`}
            isClear
            value={htg}
            keyboardType="decimal-pad"
            onChangeText={text => onHtgChange(text)}
          />
          <AppInput
            label={`${t(translations.transfer.amountField)} (${t(
              translations.USD,
            )})`}
            isClear
            value={usd}
            keyboardType="decimal-pad"
            onChangeText={text => onUsdChange(text)}
          />
        </View>
        <View style={styles.titleContainer}>
          <AppText style={styles.txtTitle}>{'DEBIT DETAILS'}</AppText>
        </View>
        <ItemTransactionDetail
          style={styles.info}
          title={t(translations.paymentService.billDebit.contractCode)}
          description={data?.contractNo}
        />
        <ItemTransactionDetail
          style={styles.info}
          title={t(translations.paymentService.service)}
          description={data?.service}
        />
        <ItemTransactionDetail
          style={styles.info}
          title={t(translations.paymentService.customerName)}
          description={data?.customerName}
        />
        <ItemTransactionDetail
          style={styles.info}
          title={t(translations.paymentService.debitAmount)}
          description={`${CurrencyHelper.formatAmount(
            data?.debitAmountHTG?.toString() || '',
          )} ${translations.HTG}`}
        />
        <ItemTransactionDetail
          style={styles.info}
          title={''}
          description={`${CurrencyHelper.formatAmount(
            data?.debitAmountUSD.toString() || '',
          )} ${translations.USD}`}
        />
        <ItemTransactionDetail
          style={styles.info}
          title={t(translations.paymentService.billDebit.exchangeRate)}
          description={`${CurrencyHelper.formatAmount(
            data?.exchangeRate.toString() || '',
          )} (${translations.USD} -> ${translations.HTG})`}
        />
        <View style={styles.buttonContainer}>
          <AppButton
            disabled={!htg}
            onPress={() => onContinue()}
            shadow
            title={t(translations.transfer.continue)}
          />
        </View>
      </Container>
      <ErrorModal
        confirmTitle={t(translations.changePin.tryAgain)}
        onConfirm={() => tryAgain()}
        isVisible={showError}
        title={error?.title || ''}
        description={error?.description}
      />
    </>
  );
};
