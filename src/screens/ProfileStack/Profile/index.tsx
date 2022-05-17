import React, {useCallback, useState, useRef} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {device_width} from 'helpers/Mixin';
import ItemProfile from './ItemProfile';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from 'components/atoms/AppText';
import {images} from 'assets';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import AppButton from 'components/atoms/Button';
import GoToGold from '../../Home/components/GoToGold';
import {styles} from './styles';
import {HookHelper, KeysHelper, StringHelper} from 'helpers';
import {theme} from 'utils/styles/theme';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {AuthenticationActions, UserActions} from 'stores/actions';
import {ChangeLanguageModal} from './components/ChangeLanguageModal';
import Share from 'react-native-share';
import {Mixin} from 'helpers';

import {version} from 'utils/Const';

import {useLoadingContext} from 'helpers/loadingHelper';
import AuthenticationServices from 'services/AuthenticationServices';
import {Image} from 'react-native-elements';
import {
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import {BottomModal} from 'components/atoms/BottomModal';

function wp(percentage: number) {
  const value = (percentage * device_width) / 100;
  return Math.round(value);
}

const slideWidth = wp(70);
const itemHorizontalMargin = wp(1);

export const sliderWidth = device_width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export const Profile = () => {
  const {t, translations, dispatch} = HookHelper.useBaseHook();
  const {showLoading, hideLoading} = useLoadingContext();
  const {navigation} = useGetNavigation();
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const urlInvite = useAppSelector(
    state => state.AuthenticationReducer.urlInvite,
  );
  const useBiometric = useAppSelector(
    state => state.AuthenticationReducer.useBiometric,
  );
  const avatar = useAppSelector(state => state.UserReducer.avatar);

  const balance = useAppSelector(state => state.UserReducer.balance);
  const [activeSlide, setActiveSlide] = useState(0);
  const [languageModal, setLanguageModal] = useState(false);
  const [slideLayoutHeight, setSlideLayoutHeight] = useState(0);

  const [dataSlide, setDataSlide] = useState([{}, {type: 'create'}]);

  // const [avatar, setAvatar] = useState();

  const [modalAvatar, setModalAvatar] = useState(false);

  const [showBalance, setShowBalance] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [showBottomModal, setShowBottomModal] = useState(false);

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

  // const requestCameraPermission = async () => {
  //   const grantedcamera = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.CAMERA,
  //     {
  //       title: "App Camera Permission",
  //       message:"App needs access to your camera ",
  //       buttonNeutral: "Ask Me Later",
  //       buttonNegative: "Cancel",
  //       buttonPositive: "OK"
  //     }
  //   );
  //   const grantedstorage = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     {
  //       title: "App Camera Permission",
  //       message:"App needs access to your camera ",
  //       buttonNeutral: "Ask Me Later",
  //       buttonNegative: "Cancel",
  //       buttonPositive: "OK"
  //     }
  //   );
  //   if (grantedcamera === PermissionsAndroid.RESULTS.GRANTED && grantedstorage ===  PermissionsAndroid.RESULTS.GRANTED) {
  //     setModalAvatar(true)
  //     console.log("Camera & storage permission given");
  //   } else {
  //     console.log("Camera permission denied");
  //   }
  // };
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
  const openSettingsDevice = () => {
    setShowBottomModal(false);
    openSettings();
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
  const onPressShare = async () => {
    const shareOption = {
      message: urlInvite,
    };
    try {
      const shareResponse = await Share.open(shareOption);
    } catch (error) {}
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {userInfo ? (
          <View style={styles.headerContentContainer}>
            <TouchableOpacity onPress={() => requestCameraPermission()}>
              <Image
                resizeMode="cover"
                source={avatar ? {uri: avatar} : images.avatar}
                style={styles.avatar}
              />
              <View style={styles.viewCamera}>
                <Icon name="camera" size={16} color="black" />
              </View>
            </TouchableOpacity>
            <View style={{alignItems: 'flex-start', marginLeft: 12}}>
              <AppText style={styles.name} white>
                {userInfo?.fullName}
              </AppText>
              <AppText white>
                {StringHelper.formatPhoneNumber(userInfo?.accountNumber)}
              </AppText>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              dispatch(AuthenticationActions.skipLogin.request(false))
            }
            style={styles.logoContainer}>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={images.logo_white}
            />
            <AppText style={[styles.smallText, {color: 'white'}]}>
              {t(translations.home.login)}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSlider = () => {
    return (
      <View style={{position: 'relative'}}>
        <View
          style={{
            backgroundColor: theme.colors?.primary,
            height: slideLayoutHeight / 3,
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        />
        <View
          style={{paddingLeft: Mixin.moderateSize(20)}}
          onLayout={event =>
            setSlideLayoutHeight(event.nativeEvent.layout.height)
          }>
          <Carousel
            data={dataSlide}
            renderItem={renderItemSlide}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={0}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            activeAnimationType={'spring'}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            onSnapToItem={(index: any) => setActiveSlide(index)}
            activeSlideAlignment={'start'}
          />
          <Pagination
            dotsLength={dataSlide.length}
            activeDotIndex={activeSlide}
            dotStyle={styles.paginationDotStyle}
            containerStyle={styles.paginationContainer}
            dotContainerStyle={{marginRight: 0}}
            inactiveDotOpacity={0.2}
            inactiveDotScale={1}
          />
        </View>
      </View>
    );
  };

  const renderItemSlide = ({item, index}: any, parallaxProps: any) => {
    if (item?.type === 'create') {
      return (
        <View style={styles.itemCreateSlide}>
          <Icon name="plus" size={32} color="black" />
        </View>
      );
    }
    return (
      <View style={[styles.itemSlideContainer, {width: itemWidth}]}>
        <Image source={images.icon_natcash_balance} style={styles.iconBg} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText style={{color: 'gray', marginRight: 8}}>
            {t(translations.home.viewBalance)}
          </AppText>
          <TouchableOpacity
            // disabled={userInfo ? false : true}
            onPress={() =>
              userInfo
                ? setShowBalance(!showBalance)
                : navigation.navigate('ChangePin')
            }>
            <Icon
              name={showBalance ? 'eye' : 'eye-off'}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <AppText style={styles.balance} h3>
          {showBalance ? balance : '*****'}
        </AppText>
        <AppText style={{color: 'gray'}}>HTG</AppText>
      </View>
    );
  };

  const renderMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.menuAbove}>
          <ItemProfile
            icon={images.icon_profile_info}
            title={t(translations.profile.aboutNatCash)}
            onPress={() => navigation.navigate('About')}
          />
          {userInfo ? (
            <ItemProfile
              icon={images.icon_profile_lock}
              title={t(translations.profile.changePin)}
              onPress={() => navigation.navigate('ChangePin')}
            />
          ) : null}

          {userInfo ? (
            <ItemProfile
              icon={images.icon_profile_fingerprint}
              title={t(translations.profile.useFingerPrint)}
              enableSwitch
              enabled={useBiometric}
              onPress={() =>
                dispatch(
                  AuthenticationActions.setBiometric.request(!useBiometric),
                )
              }
              onChangeSwitch={value =>
                dispatch(AuthenticationActions.setBiometric.request(value))
              }
            />
          ) : null}
        </View>
        <View style={styles.menuBelow}>
          <ItemProfile
            icon={images.icon_profile_language}
            title={t(translations.profile.changeLanguage)}
            onPress={() => setLanguageModal(true)}
          />
          {userInfo ? (
            <ItemProfile
              icon={images.icon_profile_group_user}
              title={t(translations.profile.inviteFriend)}
              onPress={() => navigation.navigate('Invite')}
            />
          ) : null}
          <ItemProfile
            icon={images.icon_profile_location}
            title={t(translations.profile.nearbyAgents)}
            onPress={() => navigation.navigate('MapScreen')}
          />
          <ItemProfile
            icon={images.icon_profile_info}
            title={t(translations.profile.feeAndLimit)}
            onPress={() => navigation.navigate('FeeAndLimit')}
          />
          
        </View>
        <View style={styles.bottomViewContainer}>
          <Text style={styles.normalText}>
            {`${t(translations.profile.version)} ${KeysHelper.getVersion()}`}
          </Text>
        </View>

        {userInfo ? (
          <TouchableOpacity
            onPress={() => {
              AuthenticationServices.logout();
              dispatch(AuthenticationActions.logout.request());
            }}
            style={styles.btnLogoutContainer}>
            <Text style={styles.largeText}>{t(translations.logout)}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

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

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={{flex: 6}}>
        {renderSlider()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}>
          {userInfo && userInfo.accountType === 0 && (
            <GoToGold onRightButton={() => navigation.navigate('ComingSoon')} />
          )}

          {renderMenu()}
        </ScrollView>
      </View>
      <ChangeLanguageModal
        onSelect={() => setLanguageModal(false)}
        isVisible={languageModal}
        onCancel={() => setLanguageModal(false)}
      />
      {renderModalAvatar()}
      <BottomModal
        onConfirm={() => openSettingsDevice()}
        isVisible={showBottomModal}
        confirmTitle={t(translations.transfer.continue)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>
            {'This app requires to access your photo library and camera'}
          </AppText>
        </View>
      </BottomModal>
    </View>
  );
};
