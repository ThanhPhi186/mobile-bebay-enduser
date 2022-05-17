import React, {useCallback, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  useFocusEffect,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  QRScan,
  CashIn,
  Home,
  Transaction,
  SearchService,
  Profile,
  Transfer,
  TopUpStack,
  DataStack,
  ProfileStack,
  WithdrawStack,
  ServicePaymentStack,
  PromotionStack,
  ComingSoon,
  Notifications,
  AllRecentTransaction,
  TransactionDetail
} from 'screens';
import {TabRoute} from 'navigation/TabRoute';
import {ProtectedScreens, RouteParamList} from './RouteParamList';
import {useAppSelector, useBiometric} from 'helpers/hookHelper';
import {BottomModal} from 'components/atoms/BottomModal';
import {StyleSheet, View} from 'react-native';
import AppText from 'components/atoms/AppText';
import {translations} from 'utils/i18n';
import {useTranslation} from 'react-i18next';
import {BiometricIcon} from 'components/modules/BiometricIcon';
import {useDispatch} from 'react-redux';
import {AuthenticationActions} from 'stores/actions';

const Stack = createNativeStackNavigator<RouteParamList>();
const styles = StyleSheet.create({
  biometricContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export const HomeRoute = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const navigationRef = useNavigationContainerRef();
  const {canBiometric, biometricName, authentication} = useBiometric();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [showBiometricModal, setShowBioMetricModal] = useState(false);
  const checkCanShowBiometric = () => {
    return (
      authenticationReducer.loginToken &&
      authenticationReducer.useBiometric === undefined &&
      canBiometric
    );
  };
  useEffect(() => {
    if (checkCanShowBiometric()) {
      setTimeout(() => {
        setShowBioMetricModal(true);
      }, 500);
    }
  }, [authenticationReducer.loginToken, canBiometric]);
  const onBiometricConfirm = async () => {
    const result = await authentication();
    if (result.success) {
      setShowBioMetricModal(false);
      dispatch(AuthenticationActions.setBiometric.request(true));
    } else {
      setShowBioMetricModal(false);
      dispatch(AuthenticationActions.setBiometric.request(false));
    }
  };
  const onCancel = () => {
    setShowBioMetricModal(false);
    dispatch(AuthenticationActions.setBiometric.request(false));
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={async () => {
        if (navigationRef) {
          const currentRoute = navigationRef.getCurrentRoute();
          if (currentRoute) {
            const routeName = currentRoute.name as keyof RouteParamList;
            if (
              authenticationReducer.skipLogin &&
              !authenticationReducer.userInfo &&
              ProtectedScreens.includes(routeName)
            ) {
              dispatch(AuthenticationActions.skipLogin.request(false));
            }
          }
        }
      }}>
      <Stack.Navigator
        // initialRouteName="MyQr"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="TabRoute" component={TabRoute} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="SearchService" component={SearchService} />
        <Stack.Screen name="TransferMoney" component={Transfer.TransferMoney} />
        <Stack.Screen name="ConfirmDetail" component={Transfer.ConfirmDetail} />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="TransactionResult"
          component={Transfer.TransactionResult}
        />
        <Stack.Screen name="TransferBank" component={Transfer.TransferBank} />
        <Stack.Screen name="TopUp" component={TopUpStack.TopUp} />
        <Stack.Screen name="ConfirmTopUp" component={TopUpStack.ConfirmTopUp} />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="TopUpResult"
          component={TopUpStack.TopUpResult}
        />
        <Stack.Screen name="DataExchange" component={DataStack.DataExchange} />
        <Stack.Screen name="BuyData" component={DataStack.BuyData} />
        <Stack.Screen name="ConfirmData" component={DataStack.ConfirmData} />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="DataResult"
          component={DataStack.DataResult}
        />
        <Stack.Screen name="ChangePin" component={ProfileStack.ChangePin} />
        <Stack.Screen name="MyQr" component={ProfileStack.MyQr} />
        <Stack.Screen name="Withdraw" component={WithdrawStack.Withdraw} />
        <Stack.Screen name="CashOut" component={WithdrawStack.CashOut} />
        <Stack.Screen name="QRScan" component={QRScan} />

        <Stack.Screen
          name="ConfirmWithdraw"
          component={WithdrawStack.ConfirmWithdraw}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="WithdrawResult"
          component={WithdrawStack.WithdrawResult}
        />
        <Stack.Screen name="MapScreen" component={WithdrawStack.MapScreen} />
        <Stack.Screen name="Bill" component={ServicePaymentStack.Bill} />
        <Stack.Screen
          name="PromotionDetail"
          component={PromotionStack.PromotionDetail}
        />
        <Stack.Screen
          name="BillDetail"
          component={ServicePaymentStack.BillDetail}
        />
        <Stack.Screen name="About" component={ProfileStack.About} />
        <Stack.Screen name="FeeAndLimit" component={ProfileStack.FeeAndLimit} />

        <Stack.Screen
          options={{gestureEnabled: false}}
          name="PaymentResult"
          component={ServicePaymentStack.PaymentResult}
        />
        <Stack.Screen name="ComingSoon" component={ComingSoon} />
        <Stack.Screen name="CashIn" component={CashIn} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Invite" component={ProfileStack.Invite} />
        <Stack.Screen
          name="BillDebit"
          component={ServicePaymentStack.BillDebit}
        />
        <Stack.Screen
          name="AllRecentTransaction"
          component={AllRecentTransaction}
        />
         <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetail}
        />
      </Stack.Navigator>
      <BottomModal
        onConfirm={() => onBiometricConfirm()}
        onCancel={() => onCancel()}
        isVisible={showBiometricModal}
        cancelTitle={t(translations.biometric.cancel)}
        confirmTitle={t(translations.biometric.confirm)}
        canCancel>
        <View style={styles.biometricContainer}>
          <AppText h6>
            {t(translations.biometric.enableTitle, {value: biometricName})}
          </AppText>
          <BiometricIcon />
          <AppText caption>
            {t(translations.biometric.enableDescription)}
          </AppText>
        </View>
      </BottomModal>
    </NavigationContainer>
  );
};
