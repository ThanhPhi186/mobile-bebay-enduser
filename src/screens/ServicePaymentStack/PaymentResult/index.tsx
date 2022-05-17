import React, {useEffect, useState} from 'react';
import useStyles from './styles';
import {BackHandler, View} from 'react-native';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import {HookHelper, Mixin} from 'helpers';
import {TransactionInformation} from 'components/modules';
import HeaderTransactionDetail from 'components/modules/HeaderTransactionResult';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {useUserServices} from 'helpers/features/user';

export const PaymentResult = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const {onGetBalance} = useUserServices();
  const {navigation, route} = useGetNavigation();
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const transactionData = route.params?.transactionResult;
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    onGetBalance();
    return () => backHandler.remove();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderTransactionDetail
        title={t(translations.transfer.transactionSuccessfully)}
        description={transactionData?.totalAmount}
      />
      <View style={styles.inputContainer}>
        <TransactionInformation
          isResult
          isDash
          renderHeader={
            <View style={{width: '100%'}}>
              <ItemTransactionDetail
                title={t(translations.paymentService.service)}
                description={transactionData?.service}
              />
              <ItemTransactionDetail
                title={t(translations.data.provider)}
                description={transactionData?.provider}
              />
              <ItemTransactionDetail
                title={t(translations.paymentService.customerName)}
                description={transactionData?.customerName || ''}
              />
            </View>
          }
          renderBody={
            <View style={{width: '100%'}}>
              <ItemTransactionDetail
                title={t(translations.paymentService.service)}
                description={transactionData?.service}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.transferFrom)}
                description={`${transactionData?.transferFrom}`}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.amount)}
                description={`${transactionData?.amount}`}
              />
              {/* <ItemTransactionDetail
                title={t(translations.paymentService.discount)}
                description={`${transactionData?.discount}`}
              /> */}
              {transactionData?.fee ? <ItemTransactionDetail
                title={t(translations.transfer.fee)}
                description={transactionData?.fee}
              /> : null}
              <ItemTransactionDetail
                title={t(translations.paymentService.totalAmount)}
                description={transactionData?.totalAmount}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.transactionCode)}
                description={transactionData?.transactionCode}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.transactionTimes)}
                description={transactionData?.transactionTime}
              />
            </View>
          }>
          <View style={{width: '100%', height: 100}}></View>
        </TransactionInformation>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => navigation.navigate('TabRoute')}
          shadow
          title={t(translations.transfer.backToHome)}
        />
        <AppButton
          onPress={() => navigation.navigate('Bill')}
          shadow
          filled
          title={t(translations.transfer.newTransaction)}
        />
      </View>
    </View>
  );
};
