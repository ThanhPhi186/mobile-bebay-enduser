import {useAppSelector} from 'helpers/hookHelper';
import {useRemoteConfig, useServerDown} from 'helpers/remoteConfig';
import {AuthenticationRoute, HomeRoute} from 'navigation';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import {Overlay, ThemeProvider} from 'react-native-elements';
import {theme} from 'utils/styles/theme'; // <-- Import app theme
// import RNBootSplash from 'react-native-bootsplash';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import RenderHtml from 'react-native-render-html';
import {ServerDown} from '../screens/ServerDown';
import {useAppInIt} from 'helpers/features/appInit';
import {useLoadingContext} from 'helpers/loadingHelper';
import messaging from '@react-native-firebase/messaging';
import {useNotification} from 'helpers/features/appNotification';
import FlashMessage from 'react-native-flash-message';
import GlobalStyles from 'utils/styles/GlobalStyles';
import SplashScreen from 'react-native-splash-screen';
import {BottomModal} from 'components/atoms/BottomModal';
import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useDispatch} from 'react-redux';
import {AuthenticationActions} from 'stores/actions';

export const MainApp = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const appReducer = useAppSelector(state => state.AppReducer);
  const {isDone, remoteFetch} = useAppInIt();
  const {fetchOnly} = useRemoteConfig();
  const {loading, hideLoading} = useLoadingContext();
  const {showNotification} = useNotification();
  const deviceId = useAppSelector(state => state.AppReducer.deviceId);
  const newVersionApp = useAppSelector(state =>
    state.NewAppVersionReducer ? state.NewAppVersionReducer.newVersion : null,
  );
  const dispatch = useDispatch();
  useServerDown();
  useEffect(() => {
    let subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        fetchOnly();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription = undefined;
    };
  }, []);
  useEffect(() => {
    if (deviceId) {
      remoteFetch();
      SplashScreen.hide();
      if (isDone) {
        SplashScreen.hide();
      }
    }
  }, [deviceId]);
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        handleReferralPhoneNumber(link);
      });
  }, []);

  useEffect(() => {
    if (newVersionApp) {
      setShowUpgradeDialog(true);
    }
  }, [newVersionApp]);

  useEffect(() => {
    hideLoading();
  }, [authenticationReducer.loginToken]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showNotification(
        `${remoteMessage.notification?.title}`,
        `${remoteMessage.notification?.body}`,
      );
    });

    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   if (deviceId) {
  //     remoteFetch();
  //     SplashScreen.hide();
  //     if (isDone) {
  //       SplashScreen.hide();
  //     }
  //   }
  // }, [deviceId]);
  const handleReferralPhoneNumber = (link: any) => {
    if (link.url) {
      const arr = link.url.split('phoneNumber=');
      if (arr[1]) {
        const phoneNumber = arr[1];
        console.log(phoneNumber);
        dispatch(AuthenticationActions.setReferralNumber.request(phoneNumber));
      }
    }
  };
  const handleDynamicLink = (link: any) => {
    // Handle dynamic link inside your own application
    console.log('LINK =====>>', link);
    handleReferralPhoneNumber(link);
  };

  const checkShowUpgradeDialog = () => {
    if (showUpgradeDialog) {
      if (newVersionApp?.requireToUpgrade || newVersionApp?.showDialogUpgrade) {
        return true;
      }
    }
    return false;
  };

  const renderMainApp = () =>
    authenticationReducer.loginToken || authenticationReducer.skipLogin ? (
      <HomeRoute />
    ) : (
      <AuthenticationRoute />
    );
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors?.primary}
      />
      {appReducer.is_server_down ? <ServerDown /> : renderMainApp()}
      <Overlay
        overlayStyle={{backgroundColor: 'transparent', elevation: 0}}
        style={{backgroundColor: 'transparent'}}
        isVisible={loading}>
        <ActivityIndicator
          size={'large'}
          color={theme.colors?.primary}
          style={{backgroundColor: 'transparent'}}
        />
      </Overlay>
      <FlashMessage
        style={{
          ...GlobalStyles.shadow,
          backgroundColor: 'white',
          borderBottomColor: theme.colors?.primary,
          borderBottomWidth: 1,
        }}
        titleStyle={{fontWeight: 'bold', color: theme.colors?.primary}}
        textStyle={{color: 'black'}}
        position="top"
      />
      {checkShowUpgradeDialog() && (
        <BottomModal
          confirmTitle="Upgrade"
          onConfirm={async () => {
            await Linking.openURL(`${newVersionApp?.appStoreUrl}`);
            setShowUpgradeDialog(false);
          }}
          canCancel={!newVersionApp!.requireToUpgrade}
          cancelTitle="Later"
          onCancel={() => setShowUpgradeDialog(false)}
          isVisible={true}>
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              padding: Mixin.moderateSize(8),
            }}>
            <AppText
              style={{
                marginBottom: Mixin.moderateSize(16),
                width: '100%',
                textAlign: 'center',
              }}
              h6>
              {`New version - ${newVersionApp?.appVersion}`}
            </AppText>
            <RenderHtml
              contentWidth={Mixin.device_width - Mixin.moderateSize(32)}
              source={{html: newVersionApp?.description || ''}}
            />
          </ScrollView>
        </BottomModal>
      )}
    </ThemeProvider>
  );
};
