import React, { useEffect, useState } from 'react';
// import {Layout, Button, Text} from '@ui-kitten/components';
import useStyles from './styles';

import { BackHandler, View } from 'react-native';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import { HookHelper } from 'helpers';
import { TransactionInformation } from 'components/modules';
import HeaderTransactionDetail from 'components/modules/HeaderTransactionResult';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import { useUserServices } from 'helpers/features/user';
import { useCommon } from 'helpers/features/common';
import { FEATURE_CODE } from 'models/EFeatureCode';

export const TransactionResult = () => {
  const { theme, t, translations, showLoading, hideLoading } =
    HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const { onGetBalance } = useUserServices();
  const { navigation, route } = useGetNavigation<'TransactionResult'>();
  const [isFavorite, setIsFavorite] = useState(false);

  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const { onTransactionFavorite } = useCommon();

  const transactionData = route.params?.transactionResult;
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    onGetBalance();
    return () => backHandler.remove();
  }, []);
  const onPressFavorite = async () => {
    showLoading();
    const result = await onTransactionFavorite(
      transactionData?.transId!,
      FEATURE_CODE.TRANSFER_MONEY,
      2,
    );
    console.log('result', result);

    if (result?.succeed) {
      setIsFavorite(true);
    }
  };
  return (
    <Container scrollEnabled={true}>
      <HeaderTransactionDetail
        title={t(translations.transfer.transactionSuccessfully)}
        description={transactionData?.totalAmount!}
        isCheckFavorite
        onPressFavorite={() => onPressFavorite()}
        isFavorite={isFavorite}
      />
      <View style={styles.inputContainer}>
        <TransactionInformation
          isDash
          renderHeader={
            <View style={{ width: '100%' }}>
              <ItemTransactionDetail
                title={t(translations.transfer.receiverPhone)}
                description={transactionData?.receiver?.accountNumber}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.receiverName)}
                description={transactionData?.receiver?.accountName}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.content)}
                description={transactionData?.content}
              />
            </View>
          }
          renderBody={
            <View style={{ width: '100%' }}>
              {/* <ItemTransactionDetail
                title={t(translations.transfer.transferFrom)}
                description={`${userInfo?.accountNumber}`}
              /> */}
              <ItemTransactionDetail
                title={t(translations.transfer.SenderAccount)}
                description={`${userInfo?.accountNumber}`}
              />
              <ItemTransactionDetail
                title={t(translations.transfer.amountField)}
                description={`${transactionData?.totalAmount}`}
              />
              {transactionData?.fee ? <ItemTransactionDetail
                title={t(translations.transfer.fee)}
                description={transactionData?.fee}
              /> : null}
              <ItemTransactionDetail
                title={t(translations.transfer.transactionCode)}
                description={transactionData?.refId}
              />
              <ItemTransactionDetail
                title={t(translations.withdraw.transactionTimes)}
                description={transactionData?.transactionTime}
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
          onPress={() => navigation.navigate('TransferMoney')}
          shadow
          filled
          title={t(translations.transfer.newTransaction)}
        />
      </View>
    </Container>
  );
};
