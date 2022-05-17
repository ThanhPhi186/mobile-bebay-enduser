import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  View,
  Dimensions,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {images} from 'assets';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {useNavigation} from '@react-navigation/core';
import Container from 'components/atoms/Container';
import {ListPromotion} from './components/ListPromotion';
import {ListService} from './components/ListService';
import GlobalStyles from 'utils/styles/GlobalStyles';
import useStyles from './styles';
import {HookHelper, Mixin, StringHelper} from 'helpers';
import AppText from 'components/atoms/AppText';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {useHomeServices} from 'helpers/features/home';
import {INew} from 'models/INew';
import {useUserServices} from 'helpers/features/user';
import GoToGold from './components/GoToGold';
import {BannerSlider} from 'components/modules/BannerSlider';
import {Badge, Image} from 'react-native-elements';
import {
  AuthenticationActions,
  NewVersionActions,
  UserActions,
} from 'stores/actions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import AppButton from 'components/atoms/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PaymentServiceList, ServiceList} from 'models/IServices';
import {
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import {BottomModal} from 'components/atoms/BottomModal';
import {sortedLastIndexBy} from 'lodash';
import NotificationServices from 'services/NotificationServices';
import {useDispatch} from 'react-redux';
import _ from 'lodash';
import messaging from '@react-native-firebase/messaging';

export const Home = () => {
  const {theme, t, translations, dispatch} = HookHelper.useBaseHook();
  const balance = useAppSelector(state => state.UserReducer?.balance);
  const skipLogin = useAppSelector(
    state => state.AuthenticationReducer.skipLogin,
  );
  const avatar = useAppSelector(state => state.UserReducer.avatar);
  const notificationUnread = useAppSelector(
    state => state.UserReducer.totalNumberUnread,
  );
  const useBiometric = useAppSelector(
    state => state.AuthenticationReducer.useBiometric,
  );
  const {onGetInfo} = useHomeServices();
  const {onGetBalance} = useUserServices();
  const {navigation} = useGetNavigation();
  const [hotNews, setHotNews] = useState<INew[]>([]);
  const [listNews, setListNews] = useState<INew[]>([]);
  const [bigVoucher, setBigVoucher] = useState<INew[]>([]);
  const [hotDeal, setHotDeal] = useState<INew[]>([]);
  const [promotion, setPromotion] = useState<INew[]>([]);
  const [greeting, setGreeting] = useState<string>();
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const [modalAvatar, setModalAvatar] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const styles = useStyles(theme);
  const [showBottomModal, setShowBottomModal] = useState(false);

  // const HEADER_MAX_HEIGHT = userInfo && userInfo.accountType == 0 ? 340 : 290;
  const HEADER_MAX_HEIGHT = 290;

  const HEADER_MIN_HEIGHT = HEADER_MAX_HEIGHT - 250;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const HEIGHT_STATUS_BAR = Platform.OS === 'ios' ? getStatusBarHeight() : 20;
  const HEIGHT_BANNER = Platform.OS === 'ios' ? 120 : 100;
  const HEIGH_PROFILE_VIEW = 70;
  const HEIGH_BALANCE_VIEW = 80;
  const HEIGHT_SERVICE = 90;
  // const HEIGHT_GOLD_VIEW = userInfo && userInfo.accountType === 0 ? 50 : 0;
  const HEIGHT_GOLD_VIEW = 0;

  const HEIGHT_PADDING = Platform.OS === 'ios' ? getStatusBarHeight() : 20;

  const actions = [
    {
      title: t(translations.profile.camera),
      type: 'capture',
      options: {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: false,
      },
    },
    {
      title: t(translations.profile.chooseLibrary),
      type: 'library',
      options: {
        maxHeight: 200,
        maxWidth: 200,
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
      },
    },
  ];

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE + 100],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const bannerzIndex = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1000, 1000, -1],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -250],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 1],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2 - 100, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -(HEADER_MAX_HEIGHT - 120)],

    extrapolate: 'clamp',
  });
  const getNotificationUnread = async () => {
    const response = await NotificationServices.getNotifications(1);
    if (response.succeeded && !response.failed && response.data) {
      dispatch(
        UserActions.setTotalNumberUnread.request(
          response.data.totalNumberUnread || 0,
        ),
      );
    }
  };
  if (Platform.OS === 'android') {
    useEffect(() => {
      getHomeInfo();
    }, []);
  } else {
    useEffect(() => {
      if (useBiometric !== undefined || skipLogin) {
        getHomeInfo();
      }
    }, [useBiometric, skipLogin]);
  }

  useEffect(() => {
    if (userInfo) {
      getNotificationUnread();
    }
  }, [userInfo]);
  useEffect(() => {
    if (checked) {
      onGetBalance();
    }
  }, [checked]);
  useEffect(() => {
    onGetBalance();
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      dispatch(
        UserActions.setTotalNumberUnread.request(
          remoteMessage?.data?.unread || 0,
        ),
      );
    });

    return unsubscribe;
  }, []);
  const getHomeInfo = async () => {
    const result = await onGetInfo();
    console.log('HOME INFO', result);
    if (result?.data?.hotNews) {
      setHotNews(result.data.hotNews);
    }
    if (result?.data?.hotDeal) {
      setHotDeal(result.data.hotDeal);
    }
    if (result?.data?.bigVourcher) {
      setBigVoucher(result.data.bigVourcher);
    }
    if (result?.data?.promotion) {
      setPromotion(result.data.promotion);
    }
    if (result?.data?.listNews) {
      setListNews(result.data.listNews);
    }
    setGreeting(result?.data?.greetingMessage);
    if (!_.isEmpty(result?.data?.newAppVersion)) {
      dispatch(
        NewVersionActions.setNewVersion.request(result?.data?.newAppVersion!),
      );
    }
  };

  const openSettingsDevice = () => {
    setShowBottomModal(false);
    openSettings();
  };
  function renderBalance() {
    return (
      <View style={styles.balanceContainer}>
        <View style={styles.wrapBalance}>
          <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={styles.wrapBalance}>
            <AppText style={styles.mediumText}>
              {t(translations.home.viewBalance)}
            </AppText>
            <Image
              style={styles.iconEye}
              resizeMode="contain"
              source={checked ? images.iconEye : images.iconHiddenEye}
            />
          </TouchableOpacity>
          <View style={{position: 'absolute', right: 0}}>
            <Image
              style={styles.logoNatcash}
              resizeMode="contain"
              source={images.logo_white}
            />
          </View>
        </View>
        <View style={styles.wrapBalance}>
          <View style={styles.wrapBalance}>
            {checked ? (
              <AppText style={styles.LargeText}>{`${balance || 0}`}</AppText>
            ) : (
              <Text style={styles.LargeText}>{'******'}</Text>
            )}
          </View>
          <View style={{position: 'absolute', right: 0}}>
            <AppText style={styles.mediumText}>{'HTG'}</AppText>
          </View>
        </View>
      </View>
    );
  }
  function renderHeaderListService() {
    return (
      <Animated.View
        style={[
          styles.topBar,
          {
            transform: [{scale: titleScale}, {translateY: titleTranslateY}],
          },
          {
            marginTop:
              HEIGH_BALANCE_VIEW +
              HEIGH_PROFILE_VIEW +
              HEIGHT_GOLD_VIEW +
              HEIGHT_STATUS_BAR +
              20,
          },
        ]}>
        <ListService data={ServiceList} />
      </Animated.View>
    );
  }

  function renderHeader() {
    return (
      <View style={[styles.headerContainer, {height: HEIGH_PROFILE_VIEW}]}>
        {userInfo && (
          // <Image
          //   style={styles.avatar}
          //   source={avatar ? {uri: avatar} : images.avatar}
          // />
          <TouchableOpacity onPress={() => requestCameraPermission()}>
            <Image
              source={avatar ? {uri: avatar} : images.avatar}
              style={styles.avatar}
            />
            <View style={styles.viewCamera}>
              <Icon name="camera" size={13} color="black" />
            </View>
          </TouchableOpacity>
        )}
        {userInfo ? (
          <View style={styles.userInfoContainer}>
            <View>
              <AppText style={[styles.LargeText, {color: '#263238'}]}>
                {userInfo?.fullName}
              </AppText>
              <AppText style={[styles.smallText, {color: '#263238'}]}>
                {StringHelper.formatPhoneNumber(userInfo?.accountNumber!)}
              </AppText>
            </View>
            {userInfo && userInfo.accountType === 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('ComingSoon')}
                style={styles.containerGold}>
                <Image
                  style={styles.imgCrownWhite}
                  source={images.IconCrownWhite}
                />
                <AppText style={styles.txtUpgrade} white>
                  {t(translations.upgrade)}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              dispatch(AuthenticationActions.skipLogin.request(false))
            }
            style={styles.logoContainer}>
            <Image style={styles.logo} source={images.logo_home} />
            <AppText style={[styles.smallText, {color: '#263238'}]}>
              {t(translations.home.login)}
            </AppText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Image
            style={styles.iconNotification}
            source={images.iconNotification}
          />
          {notificationUnread !== 0 && (
            <Badge
              status="primary"
              value={notificationUnread}
              containerStyle={{position: 'absolute', top: -5, right: -10}}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
  function renderBody() {
    return (
      <Animated.ScrollView
        contentContainerStyle={{
          marginTop:
            HEADER_MAX_HEIGHT +
            HEIGHT_BANNER +
            HEIGHT_PADDING -
            (isIphoneX() ? 40 : 10),
          paddingBottom: HEADER_MAX_HEIGHT * 2 - 50,
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        <ListService data={PaymentServiceList} />
        {/* <View style={{width: '100%'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchService')}
            style={styles.btnViewAllService}>
            <AppText
              style={[styles.mediumText, {color: theme.colors?.primary}]}>
              {t(translations.home.viewAllService)}
            </AppText>
          </TouchableOpacity>
        </View> */}
        {/* <ListPromotion news={listNews} title={'Promotion'} /> */}
        <ListPromotion
          id={1}
          news={hotDeal}
          title={t(translations.home.hotDeal)}
        />
        {/* <ListPromotion
          id={2}
          news={bigVoucher}
          title={t(translations.home.bigVoucher)}
        /> */}
        <ListPromotion
          id={3}
          news={promotion}
          title={t(translations.promotion.promotion)}
        />
        {greeting && (
          <AppText
            body3
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: Mixin.moderateSize(40),
              color: '#000000',
              opacity: 0.3,
            }}>
            {greeting}
          </AppText>
        )}
      </Animated.ScrollView>
    );
  }

  function renderBodyWithoutAuthentication() {
    return (
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          marginTop: HEIGHT_BANNER,
          paddingTop: 80,
          paddingBottom: HEADER_MAX_HEIGHT / 2,
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30}}>
          <ListService data={PaymentServiceList} />
        </View>
        {/* <View style={{width: '100%'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchService')}
            style={styles.btnViewAllService}>
            <AppText
              style={[styles.mediumText, {color: theme.colors?.primary}]}>
              {t(translations.home.viewAllService)}
            </AppText>
          </TouchableOpacity>
        </View> */}
        <ListPromotion
          id={1}
          news={hotDeal}
          title={t(translations.home.hotDeal)}
        />
        <ListPromotion
          id={2}
          news={bigVoucher}
          title={t(translations.home.bigVoucher)}
        />
        <ListPromotion
          id={3}
          news={promotion}
          title={t(translations.promotion.promotion)}
        />
      </ScrollView>
    );
  }

  function renderBannerView() {
    return (
      <Animated.View
        style={[
          styles.CarouselContainer,
          {
            opacity: imageOpacity,
            transform: [{translateY: imageTranslateY}],
            zIndex: bannerzIndex,
          },
          {marginTop: userInfo ? HEADER_MAX_HEIGHT + HEIGHT_PADDING - 20 : 80},
        ]}>
        <BannerSlider isHome news={hotNews} />
      </Animated.View>
    );
  }

  function renderTopView() {
    return (
      <Animated.View
        style={[
          styles.header,
          {transform: [{translateY: headerTranslateY}]},
          {
            height: userInfo ? HEADER_MAX_HEIGHT + HEIGHT_STATUS_BAR + 20 : 100,
          },
        ]}>
        <View
          style={[
            styles.bottomView,
            {
              height: HEADER_MAX_HEIGHT + HEIGHT_STATUS_BAR + 10,
            },
          ]}>
          <Animated.View
            style={[
              styles.headerBackground,
              {
                opacity: imageOpacity,
                transform: [{translateY: imageTranslateY}],
                height: HEADER_MAX_HEIGHT,
              },
            ]}
          />
          <Animated.View
            style={{
              width: '100%',
              marginTop: userInfo ? HEIGHT_STATUS_BAR : 0,
              opacity: imageOpacity,
              backgroundColor: 'white',
              transform: [{translateY: imageTranslateY}],
            }}>
            {renderHeader()}
            {/* {userInfo && userInfo.accountType === 0 && (
              <GoToGold onRightButton={() => console.log('ok')} />
            )} */}
            {userInfo && renderBalance()}
          </Animated.View>
        </View>
      </Animated.View>
    );
  }
  const updateAvatar = (res: any) => {
    if (res.didCancel) {
    } else if (res.errorMessage) {
      console.log(res.errorMessage);
    } else if (res.errorCode) {
      console.log(res.errorCode);
    } else {
      // setAvatar(res.assets[0].uri);
      dispatch(UserActions.setAvatar.request(res.assets[0].uri));
    }
  };

  const requestCameraPermission = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    ).then(result => {
      if (result == RESULTS.GRANTED) setModalAvatar(true);
      else {
        setShowBottomModal(true);
      }
    });
  };

  const handleImage = useCallback((type, options) => {
    setModalAvatar(false);
    if (type === 'capture') {
      setTimeout(() => {
        launchCamera(options, updateAvatar);
      }, 200);
    } else {
      setTimeout(() => {
        launchImageLibrary(options, updateAvatar);
      }, 200);
    }
  }, []);
  const renderModalAvatar = () => {
    return (
      <Overlay
        isVisible={modalAvatar}
        onBackdropPress={() => setModalAvatar(false)}
        overlayStyle={styles.overlay}>
        <View>
          <AppButton
            key={actions[0].title}
            title={actions[0].title}
            onPress={() => handleImage(actions[0].type, actions[0].title)}
          />
          <AppButton
            filled={false}
            key={actions[1].title}
            title={actions[1].title}
            type="clear"
            onPress={() => handleImage(actions[1].type, actions[1].title)}
          />
        </View>
      </Overlay>
    );
  };
  if (userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        {renderModalAvatar()}
        {renderBody()}
        {renderTopView()}
        {renderBannerView()}
        {renderHeaderListService()}
        <BottomModal
          onConfirm={() => openSettingsDevice()}
          isVisible={showBottomModal}
          confirmTitle={t(translations.transfer.continue)}>
          <View style={styles.WarningBalanceContainer}>
            <Image
              style={styles.iconWarning}
              source={images.IconWarning}></Image>
            <AppText caption>
              {'This app requires to access your photo library and camera'}
            </AppText>
          </View>
        </BottomModal>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {renderBannerView()}
          {renderBodyWithoutAuthentication()}
          {renderTopView()}
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default null;
