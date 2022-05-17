import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/src/types';
import Svg, {Path} from 'react-native-svg';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {TouchableOpacity as TouchButton} from 'react-native-gesture-handler';
import {images} from '../../assets';
import {useTranslation} from 'react-i18next';
import {translations} from 'utils/i18n';
import {Mixin} from 'helpers';
import {Icon, Image, makeStyles} from 'react-native-elements';
import {useBaseHook, useGetNavigation} from '../../helpers/hookHelper';
import {useNavigation} from '@react-navigation/native';

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    // height: isIphoneX() ? 100 : 80,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor: 'transparent',
  },
  qrContainer: {
    height: isIphoneX() ? 100 : 80,
    width: 75,
    position: 'relative',
    alignItems: 'center',
  },
  qrButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Mixin.moderateSize(46),
    height: Mixin.moderateSize(46),
    borderRadius: Mixin.moderateSize(46 / 2),
    marginTop: Mixin.moderateSize(isIphoneX() ? -26 : -36),
    backgroundColor: 'white',
  },
  icon: {
    width: Mixin.moderateSize(46),
    height: Mixin.moderateSize(46),
  },

  routeContainer: {
    height: isIphoneX() ? 100 : 80,
    flex: 1,
    // backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20,
  },
  firstRouteRadius: {
    borderTopLeftRadius: 20,
  },
  lastRouteRadius: {
    borderTopRightRadius: 20,
  },
  label: {
    position: 'absolute',
    color: '#e5e5e5',
    bottom: isIphoneX() ? 30 : 10,
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
  },
  selectedLabel: {
    position: 'absolute',
    color: theme.colors?.primary,
    bottom: isIphoneX() ? 30 : 10,
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
  },
}));

export const TabBar: React.FC<BottomTabBarProps> = props => {
  const {state, descriptors, navigation} = props;
  const {theme, t, translations} = useBaseHook();
  const styles = useStyles(theme);
  const isFocused = (index: number) => index === state.index;

  const onPress = (index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });
    if (!isFocused(index) && !event.defaultPrevented) {
      navigation.navigate(state.routes[index].name);
    }
  };

  return (
    <View>
      <ImageBackground
        source={images.tabbarBackground}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => onPress(0)}
          style={[styles.routeContainer, styles.firstRouteRadius]}>
          <Icon
            style={styles.icon}
            color={isFocused(0) ? theme.colors?.primary : theme.colors?.grey1}
            name="home"
          />
          <Text style={isFocused(0) ? styles.selectedLabel : styles.label}>
            {t(translations.tabbar.Home)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(1)}
          style={styles.routeContainer}>
          <Icon
            style={styles.icon}
            color={isFocused(1) ? theme.colors?.primary : theme.colors?.grey1}
            name="sale"
          />
          <Text style={isFocused(1) ? styles.selectedLabel : styles.label}>
            {t(translations.tabbar.Promotions)}
          </Text>
        </TouchableOpacity>
        {/* <QRScan navigation={navigation} /> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('QRScan')}
          style={styles.routeContainer}>
          <View style={styles.qrButton}>
            <Image source={images.iconBarcode} style={styles.icon} />
          </View>
          <Text style={isFocused(2) ? styles.selectedLabel : styles.label}>
            {t(translations.tabbar.Scan)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(3)}
          style={styles.routeContainer}>
          <Icon
            style={styles.icon}
            color={isFocused(3) ? theme.colors?.primary : theme.colors?.grey1}
            name="clock-time-nine"
          />
          <Text style={isFocused(3) ? styles.selectedLabel : styles.label}>
            {t(translations.tabbar.Transactions)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(4)}
          style={[styles.routeContainer, styles.lastRouteRadius]}>
          <Icon
            style={styles.icon}
            color={isFocused(4) ? theme.colors?.primary : theme.colors?.grey1}
            name="account-circle"
          />
          <Text style={isFocused(4) ? styles.selectedLabel : styles.label}>
            {t(translations.tabbar.Account)}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
