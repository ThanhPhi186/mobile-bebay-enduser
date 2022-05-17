import {useTheme} from 'react-native-elements';
import {useTranslation} from 'react-i18next';
import {translations} from 'utils/i18n';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {RouteParamList} from 'navigation/RouteParamList';
import {RootReducer} from 'stores/configurations/rootReducer';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import {AuthenticationType} from 'expo-local-authentication';
import _ from 'lodash';
import {useLoadingContext} from './loadingHelper';

export const useBaseHook = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {showLoading, hideLoading} = useLoadingContext();
  const dispatch = useDispatch();
  return {
    theme,
    t,
    translations,
    dispatch,
    showLoading,
    hideLoading,
  };
};
export const useGetNavigation = <T extends keyof RouteParamList | never>() => {
  type screenProps = NativeStackNavigationProp<RouteParamList>;
  let route;
  type RootRouteProps<RouteName extends keyof RouteParamList> = RouteProp<
    RouteParamList,
    RouteName
  >;
  route = useRoute<RootRouteProps<T>>();
  const navigation = useNavigation<screenProps>();
  return {
    navigation,
    route,
  };
};

export const useBiometric = () => {
  const {t} = useTranslation();
  const [canBiometric, setCanBiometric] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [authenticationType, setAuthenticationType] =
    useState<AuthenticationType | null>(null);
  const checkCanBiometric = async () => {
    const availableBiometric = await LocalAuthentication.hasHardwareAsync();
    setCanBiometric(availableBiometric);
  };
  const checkEnrolled = async () => {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsEnrolled(enrolled);
  };
  const getAuthTypes = async () => {
    const authTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (authTypes && !_.isEmpty(authTypes)) {
      setAuthenticationType(_.last(authTypes)!);
    }
  };
  const biometricName = t(
    authenticationType === AuthenticationType.FACIAL_RECOGNITION
      ? translations.biometric.faceId
      : translations.biometric.touchId,
  );
  const authentication = async () => {
    const result = await LocalAuthentication.authenticateAsync();
    return result;
  };
  useEffect(() => {
    checkCanBiometric();
    checkEnrolled();
    getAuthTypes();
  }, []);

  return {
    canBiometric,
    isEnrolled,
    authenticationType,
    biometricName,
    authentication,
  };
};
// const store = configureStore().store;

// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootReducer> = useSelector;
