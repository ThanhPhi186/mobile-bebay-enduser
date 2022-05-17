import React, { useEffect } from 'react';

import {HookHelper} from 'helpers';
import Container from 'components/atoms/Container';
import {useGetNavigation} from 'helpers/hookHelper';
import useStyles from './styles';
import HeaderTransactionDetail from 'components/modules/HeaderTransactionResult';
import {BackHandler, View} from 'react-native';
import {TransactionInformation} from 'components/modules';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import AppButton from 'components/atoms/Button';
import { useUserServices } from 'helpers/features/user';

export const DataResult = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const {navigation, route} = useGetNavigation<'DataResult'>();

  const dataResult = route.params?.dataResult;
  const { onGetBalance } = useUserServices();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    onGetBalance();
    return () => backHandler.remove();
  }, []);

  const onNewTransaction = () => {
    navigation.reset({
      routes: [
        {
          name: 'TabRoute',
        },
        {
          name: 'DataExchange',
        },
      ],
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderTransactionDetail
        title={t(translations.transfer.transactionSuccessfully)}
        description={dataResult?.totalAmount!}
      />
      <View style={styles.inputContainer}>
        <TransactionInformation
          isResult
          isDash
          renderHeader={
            <View style={{width: '100%'}}>
              <ItemTransactionDetail
                title={t(translations.topUp.receiverPhone)}
                description={dataResult?.receiversPhone}
              />
              <ItemTransactionDetail
                title={t(translations.data.provider)}
                description={dataResult?.carrier}
              />
              <ItemTransactionDetail
                title={t(translations.data.package)}
                description={dataResult?.packageName}
              />
            </View>
          }
          renderBody={
            <View style={{width: '100%'}}>
              {/* <ItemTransactionDetail
                title={t(translations.transfer.transferFrom)}
                description={'natcash'}
              /> */}
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={dataResult?.amount}
              />
              {/* { dataResult?.discount ? <ItemTransactionDetail
                title={t(translations.data.discount)}
                description={dataResult?.discount}
              /> : null} */}
              {dataResult?.fee ? <ItemTransactionDetail
                title={t(translations.transfer.fee)}
                description={dataResult?.fee}
              /> : null}
              {dataResult?.tax ? <ItemTransactionDetail
                title={t(translations.topUp.tax)}
                description={dataResult?.tax}
              /> : null}
              <ItemTransactionDetail
                title={t(translations.topUp.totalAmount)}
                description={dataResult?.totalAmount}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.transactionCode)}
                description={dataResult?.transactionCode}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.transactionTimes)}
                description={dataResult?.transactionTime}
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
          onPress={onNewTransaction}
          shadow
          filled
          title={t(translations.transfer.newTransaction)}
        />
      </View>
    </View>
  );
};
