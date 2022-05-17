import React, {useState, useEffect} from 'react';

import AppHeader from 'components/modules/Header';
import {HookHelper, Mixin} from 'helpers';
import Container from 'components/atoms/Container';
import {View, ViewProps} from 'react-native';
import AppText from 'components/atoms/AppText';
import ItemTransactionDetail from 'components/modules/ItemTransactionDetail';
import {styles} from './styles';
import _ from 'lodash';
// import {useCheckSub} from 'helpers/features/transfer';
import AppButton from 'components/atoms/Button';
import {AccountInput} from 'components/modules/AccountInput';
import {IDataResponse} from 'models/services/IData';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {useCommon} from 'helpers/features/common';

export const BuyData = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {navigation, route} = useGetNavigation<'BuyData'>();
  const accountInfo = route.params.accountInfo;
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );

  const dataInfo = route?.params?.dataInfo;

  const [phoneNumberAccountString, setPhoneNumberAccountString] = useState(
    userInfo?.accountNumber || '',
  );
  useEffect(() => {
    if (accountInfo) {
      setPhoneNumberAccountString(accountInfo.accountNumber);
    }
  }, [accountInfo]);
  const buyData = () => {
    navigation.navigate('ConfirmData', {
      dataInfo: dataInfo as IDataResponse,
      receiversPhone: phoneNumberAccountString,
    });
  };
  const resetData = () => {
    setPhoneNumberAccountString('');
  };
  return (
    <Container scrollEnabled={false}>
      <AppHeader title={t(translations.data.dataExchange)} filled />
      <View style={{width: '100%'}}>
        <View
          style={{
            width: '100%',
            flex: 1,
            ...Mixin.padding(16),
          }}>
          <AccountInput
            accountString={phoneNumberAccountString}
            onBlur={() => {
              if (phoneNumberAccountString!.length < 11) {
                setPhoneNumberAccountString('509' + phoneNumberAccountString)
              } else {
                setPhoneNumberAccountString('509' + phoneNumberAccountString!.substring(3))
              }
            }}
            onChangeText={text => setPhoneNumberAccountString(text)}
            // onClearInput={() => resetData()}
          />
        </View>
        <View style={styles.titleContainer}>
          <AppText style={styles.txtTitle}>
            {t(translations.data.packageInformation)}
          </AppText>
        </View>
        <ItemTransactionDetail
          title={t(translations.data.provider)}
          description={dataInfo.provider}
        />
        <ItemTransactionDetail
          title={t(translations.data.amount)}
          description={dataInfo.amount}
        />
        {dataInfo.fee ? (
          <ItemTransactionDetail
            title={t(translations.transfer.fee)}
            description={dataInfo.fee}
          />
        ) : null}
        {dataInfo.discount ? (
          <ItemTransactionDetail
            title={t(translations.data.discount)}
            description={dataInfo.discount}
          />
        ) : null}
        {dataInfo.tax && (
          <ItemTransactionDetail
            title={t(translations.topUp.tax)}
            description={dataInfo.tax}
          />
        )}
        <View style={styles.titleContainer}>
          <AppText style={styles.txtTitle}>
            {t(translations.data.description)}
          </AppText>
        </View>
        <View
          style={{
            paddingHorizontal: Mixin.moderateSize(16),
            marginTop: Mixin.moderateSize(16),
          }}>
          <AppText
            style={{
              fontSize: Mixin.moderateSize(16),
              fontWeight: '700',
            }}>
            {dataInfo.packageName}
          </AppText>
          <AppText
            body2
            style={{
              marginTop: Mixin.moderateSize(12),
              lineHeight: Mixin.moderateSize(24),
            }}>
            {dataInfo.description}
          </AppText>
        </View>
      </View>
      <AppButton
        disabled={_.isEmpty(phoneNumberAccountString)}
        onPress={() => buyData()}
        shadow
        title={t(translations.data.buy)}
        buttonStyle={{
          position: 'absolute',
          bottom: Mixin.moderateSize(30),
          alignSelf: 'center',
          paddingHorizontal: Mixin.moderateSize(16),
        }}
      />
    </Container>
  );
};
