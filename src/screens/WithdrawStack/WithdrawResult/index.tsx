import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import HeaderTransactionDetail from 'components/modules/HeaderTransactionResult';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import { TransactionInformation } from 'components/modules';
import { HookHelper, Mixin } from 'helpers';
import { useUserServices } from 'helpers/features/user';
import { useGetNavigation } from 'helpers/hookHelper';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const WithdrawResult = () => {
  const { theme, t, translations } = HookHelper.useBaseHook();

  const { navigation, route } = useGetNavigation<'WithdrawResult'>();
  const { onGetBalance } = useUserServices();
  const { withdrawResult } = route.params!;

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
          name: 'Withdraw',
        },
      ],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderTransactionDetail
        title={t(translations.transfer.transactionSuccessfully)}
        description={withdrawResult?.totalAmount}
      />
      <View style={styles.inputContainer}>
        {/* <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            ...Mixin.padding(8, 16, 8, 16),
            borderRadius: 12,
            marginBottom: 8,
            alignItems: 'center',
          }}>
          <View>
            <AppText>Secret code</AppText>
            <AppText
              style={{
                fontSize: Mixin.moderateSize(16),
                fontWeight: 'bold',
                color: theme.colors?.primary,
                marginTop: 4,
              }}>
              {withdrawResult?.secretCode}
            </AppText>
          </View>
          <Icon name="share-variant" size={24} color="black" />
        </View> */}
        <TransactionInformation
          isResult
          isDash
          renderHeader={
            <View style={{ width: '100%' }}>
              <ItemTransactionDetail
                title={t(translations.data.provider)}
                description={withdrawResult?.provider || 'Natcash'}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.invoiceCustomerNumber)}
                description={withdrawResult?.customerNumber}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.agentPhone)}
                description={withdrawResult?.phoneNumberAgent}
              />
            </View>
          }
          renderBody={
            <View style={{ width: '100%' }}>
              {/*<ItemTransactionDetail*/}
              {/*  title={t(translations.transfer.transferFrom)}*/}
              {/*  description={'natcash'}*/}
              {/*/>*/}
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={withdrawResult?.amount}
              />
              {withdrawResult?.discount ? <ItemTransactionDetail
                title={t(translations.data.discount)}
                description={withdrawResult?.discount}
              /> : null}
              {withdrawResult?.fee ? <ItemTransactionDetail
                title={t(translations.transfer.fee)}
                description={withdrawResult?.fee}
              /> : null}
              {<ItemTransactionDetail
                title={t(translations.topUp.totalAmount)}
                description={withdrawResult?.totalAmount}
              />}
              <ItemTransactionDetail
                title={t(translations.transfer.transactionCode)}
                description={withdrawResult?.transactionCode}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.transactionTimes)}
                description={withdrawResult?.transactionTime}
              />
            </View>
          }>
          <View style={{ width: '100%', height: 100 }}></View>
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
