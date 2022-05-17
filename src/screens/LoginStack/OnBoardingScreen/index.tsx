import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import useStyles from './styles';
import {HookHelper, KeysHelper, Mixin} from 'helpers';
import AppButton from 'components/atoms/Button';
import AppText from 'components/atoms/AppText';
import {AppActions, AuthenticationActions} from 'stores/actions';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import Container from 'components/atoms/Container';
import {ErrorModal} from 'components/modules/ErrorModal';
import {useAppInIt} from 'helpers/features/appInit';
import {useLoadingContext} from 'helpers/loadingHelper';
import {IInitDataRequest} from 'models/services/IInitData';
import {useGetFirebaseToken} from 'helpers/features/appNotification';

export const OnBoardingScreen = () => {
  const {theme, t, translations, dispatch} = HookHelper.useBaseHook();
  const {navigation} = useGetNavigation();
  const failedInit = useAppSelector(
    state => state.AuthenticationReducer.failedInit,
  );
  const initAction = useAppSelector(
    state => state.AuthenticationReducer.action,
  );
  const {token} = useGetFirebaseToken();
  const {remoteFetch} = useAppInIt();
  const {showLoading, hideLoading} = useLoadingContext();
  const [triedAgain, setTriedAgain] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showError, setShowError] = useState(false);
  const scroll = useRef<ScrollView>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const styles = useStyles(theme);
  const onBoardings = [
    {
      title: t(translations.onBoarding.title1),
      description: t(translations.onBoarding.content1),
      img: images.bgOnBoarding1,
    },
    {
      title: t(translations.onBoarding.title2),
      description: t(translations.onBoarding.content1),
      img: images.bgOnBoarding2,
    },
    {
      title: t(translations.onBoarding.title3),
      description: t(translations.onBoarding.content3),
      img: images.bgOnBoarding3,
    },
  ];

  // const initData = () => {
  //   const initData: IInitDataRequest = {
  //     deviceModel: KeysHelper.getDeviceModel(),
  //     osName: KeysHelper.getOsName(),
  //     osVersion: KeysHelper.getOsVersion(),
  //     appVersion: KeysHelper.getVersion(),
  //     firebaseToken: token || '',
  //   };
  //   setTimeout(() => {
  //     dispatch(AuthenticationActions.initData.request(initData));
  //   }, 200);
  // };
  useEffect(() => {
    if (
      initAction === AuthenticationActions.initData.requestName ||
      initAction === AppActions.setConfig.actionName ||
      initAction === AuthenticationActions.setInitAccessToken.actionName
    ) {
      showLoading();
    } else {
      hideLoading();
      if (triedAgain) {
        if (initAction === AuthenticationActions.initData.successName) {
          setTimeout(() => {
            onDoneBoard();
          }, 100);
        }
        if (initAction === AuthenticationActions.initData.failedName) {
          setTriedAgain(false);
        }
      }
    }
  }, [initAction]);

  React.useEffect(() => {
    scrollX.addListener(({value}) => {
      if (Math.floor(value / Mixin.device_width) === onBoardings.length - 2) {
        setCompleted(true);
      }
    });
    return () => scrollX.removeListener('');
  }, [onBoardings.length, scrollX]);

  const onDoneBoard = () => {
    if (failedInit) {
      setShowError(true);
    } else {
      dispatch(AuthenticationActions.boarded.request());
      navigation.navigate('Login');
    }
  };

  const onNext = (index: number) => {
    if (index !== 2) {
      scroll.current!.scrollTo({
        x: Mixin.device_width * (index + 1),
      });
    } else {
      onDoneBoard();
    }
  };
  const tryAgain = () => {
    setShowError(false);
    setTriedAgain(true);
    setTimeout(() => {
      remoteFetch();
    }, 100);
  };

  const renderContent = () => {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEnabled
        ref={scroll}
        decelerationRate={0}
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {onBoardings.map((item, index) => (
          <View key={`img-${index}`} style={styles.imageAndTextContainer}>
            <View style={styles.contentCenter}>
              <Image
                source={item.img}
                resizeMode="contain"
                style={styles.image}
              />
              <AppText style={styles.txtTitle} subtitle2>
                {item.title}
              </AppText>
              <AppText style={styles.txtDescription} body2>
                {item.description}
              </AppText>
            </View>
            <View style={styles.bottomView}>
              <AppButton
                onPress={() => onNext(index)}
                shadow
                title={
                  index !== 2
                    ? t(translations.onBoarding.next)
                    : t(translations.onBoarding.getStated)
                }
              />
            </View>
            <TouchableOpacity
              style={styles.btnSkip}
              onPress={() => onDoneBoard()}>
              <AppText body2>{t(translations.onBoarding.skip)}</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>
    );
  };

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, Mixin.device_width);
    return (
      <View style={styles.dotsContainer}>
        {onBoardings.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const dotSize = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [8, 10, 8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {width: dotSize, height: dotSize},
                {opacity: opacity},
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Container scrollEnabled={false}>
      <View>{renderContent()}</View>
      <View style={styles.dotsRootContainer}>{renderDots()}</View>
      <ErrorModal
        onConfirm={() => tryAgain()}
        confirmTitle={t(translations.changePin.tryAgain)}
        title={'System Error'}
        description={'There was an problem, please try again'}
        isVisible={showError}
      />
    </Container>
  );
};
