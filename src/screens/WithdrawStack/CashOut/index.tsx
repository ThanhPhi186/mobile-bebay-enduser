import React, { useRef, useState } from 'react';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import { StyleSheet, View, Image } from 'react-native';
import AppInput from 'components/atoms/AppInput';
import { CurrencyHelper, HookHelper, Mixin } from 'helpers';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import _ from 'lodash';
import { theme } from 'utils/styles/theme';
import { useGetNavigation } from 'helpers/hookHelper';
import { useWithdraw } from 'helpers/features/withdraw';
import SimpleToast from 'react-native-simple-toast';
import { translations } from 'utils/i18n';
import hasLocationPermission from 'helpers/locationHelper';
import Geolocation from 'react-native-geolocation-service';
import { BottomModal } from 'components/atoms/BottomModal';
import { images } from 'assets';
import { formatAmount, formatPrice, formatBalance } from 'helpers/currencyHelper';
import ValidateRegex from 'models/EValidateRegex';

export const CashOut = () => {
  const { theme, t, translations } = HookHelper.useBaseHook();
  const { navigation } = useGetNavigation();

  const { onWithdrawInfo } = useWithdraw();

  const [amount, setAmount] = useState('');
  const [agentCode, setAgentCode] = useState('');
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageTransaction, setErrorMessageTransaction] = useState('');

  const goConfirmWithdraw = async () => {
    const withdrawInfo = await onWithdrawInfo(
      agentCode,
      `${CurrencyHelper.formatPrice(Number(amount.replace(/\,/g, '')))}`
    );
    if (!withdrawInfo?.failed) {
      navigation.navigate('ConfirmWithdraw', {
        withdrawInfo: withdrawInfo?.data!,
        agentCode: agentCode,
      });
    } else {
      setErrorMessageTransaction(withdrawInfo?.data?.message!);
      setShowBottomModal(true)
    }
  };
  const validateAmount = (amount: string) => {
    let numberAmount = amount.replace(ValidateRegex.REMOVE_FIRST_ZERO, '');
    setAmount(formatAmount(numberAmount.replace(/\,/g, '')));
  };

  return (
    <Container scrollEnabled={false}>
      <AppHeader filled title={t(translations.withdraw.cashOut)} />
      <View style={{ flex: 1, width: '100%', ...Mixin.padding(20, 12, 0, 12) }}>
        <AppInput
          label={t(translations.withdraw.agentCode)}
          value={agentCode}
          isClear
          containerStyles={{ marginVertical: 16 }}
          onChangeText={text => setAgentCode(text)}
        />
        <AppInput
          isClear
          label={t(translations.transfer.amount)}
          value={amount}
          containerStyles={{ marginVertical: 5 }}
          keyboardType="number-pad"
          onChangeText={text => validateAmount(text)}
        />
        {/* <AppText
          style={{
            fontSize: Mixin.moderateSize(14),
            color: '#848688',
            marginVertical: 12,
          }}>
          Generate code to get cash at any BDIPay’s agent
        </AppText>
        <View style={styles.viewRowCenter}>
          <View style={styles.viewCircle}>
            <AppText style={{color: theme.colors?.primary}}>1</AppText>
          </View>
          <AppText body3>Generate</AppText>
          <View style={styles.viewPrimary}>
            <AppText white>Cashout</AppText>
          </View>
          <AppText body3>transaction on app</AppText>
        </View>
        <View style={styles.viewRowCenter}>
          <View style={styles.viewCircle}>
            <AppText style={{color: theme.colors?.primary}}>2</AppText>
          </View>
          <AppText body3>Get the Secret Code</AppText>
        </View>
        <View style={styles.viewRowCenter}>
          <View style={styles.viewCircle}>
            <AppText style={{color: theme.colors?.primary}}>3</AppText>
          </View>
          <AppText body3>Bring Secret Code to </AppText>
          <View style={styles.viewPrimary}>
            <AppText white>Nearby Agent</AppText>
          </View>
        </View> */}
      </View>
      <View
        style={{
          width: '100%',
          paddingHorizontal: Mixin.moderateSize(16),
          paddingBottom: Mixin.moderateSize(30),
        }}>
        <AppButton
          customBtnStyle={{ backgroundColor: 'rgba(242,130,48,0.05)' }}
          titleStyle={{ color: theme.colors?.primary }}
          onPress={() => navigation.navigate('MapScreen')}
          title={t(translations.withdraw.findNearbyAgent)}
          icon={{
            name: 'map-marker',
            size: 24,
            color: theme.colors?.primary,
          }}
        />
        <AppButton
          disabled={_.isEmpty(amount) || _.isEmpty(agentCode)}
          onPress={goConfirmWithdraw}
          shadow
          title={t(translations.next)}
        />
      </View>
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageTransaction}</AppText>
        </View>
      </BottomModal>
    </Container>
  );
};

const styles = StyleSheet.create({
  viewCircle: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    borderColor: theme.colors?.primary,
    marginRight: 8,
  },
  viewPrimary: {
    backgroundColor: theme.colors?.primary,
    marginHorizontal: Mixin.moderateSize(4),
    padding: 4,
    borderRadius: 4,
  },
  viewRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Mixin.moderateSize(12),
  },
  WarningBalanceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconWarning: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    marginVertical: Mixin.moderateSize(20),
  },
});
