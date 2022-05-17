import React, { useEffect } from 'react';
import useStyles from './styles';
import { BackHandler, View } from 'react-native';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import { HookHelper } from 'helpers';
import { TransactionInformation } from 'components/modules';
import HeaderTransactionDetail from 'components/modules/HeaderTransactionResult';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import { useGetNavigation } from 'helpers/hookHelper';
import { useUserServices } from 'helpers/features/user';
import { device_width } from 'helpers/Mixin';

export const TopUpResult = () => {
  const { theme, t, translations } = HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const { navigation, route } = useGetNavigation<'TopUpResult'>();
  const { onGetBalance } = useUserServices();
  const { topUpResult } = route.params!;

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
          name: 'TopUp',
        },
      ],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderTransactionDetail
        title={t(translations.transfer.transactionSuccessfully)}
        description={topUpResult?.totalAmount}
      />
      <View style={styles.inputContainer}>
        <TransactionInformation
          isResult
          isDash
          renderHeader={
            <View style={{ width: '100%' }}>
              <ItemTransactionDetail
                title={t(translations.topUp.receiverPhone)}
                description={topUpResult?.receiversPhone}
              />
              <ItemTransactionDetail
                title={t(translations.data.provider)}
                description={topUpResult?.carrier}
              />
            </View>
          }
          renderBody={
            <View style={{ width: '100%' }}>
              {/* <ItemTransactionDetail
                title={t(translations.transfer.transferFrom)}
                description={'natcash'}
              /> */}
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={topUpResult?.amount}
              />
              {topUpResult?.discount ? <ItemTransactionDetail
                title={t(translations.data.discount)}
                description={topUpResult?.discount}
              /> : null}
              {topUpResult?.fee ? <ItemTransactionDetail
                title={t(translations.transfer.fee)}
                description={topUpResult?.fee}
              /> : null}
              {topUpResult?.tax && (
                <ItemTransactionDetail
                  title={t(translations.topUp.tax)}
                  description={topUpResult?.tax}
                />
              )}
              <ItemTransactionDetail
                title={t(translations.topUp.totalAmount)}
                description={topUpResult?.totalAmount}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.transactionCode)}
                description={topUpResult?.transId}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.transactionTimes)}
                description={topUpResult?.transactionTime}
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
