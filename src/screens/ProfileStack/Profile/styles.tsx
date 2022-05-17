import {Platform, StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {theme} from 'utils/styles/theme';
import {Mixin} from 'helpers';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EF',
  },
  slider: {
    overflow: 'hidden',
  },
  sliderContentContainer: {},
  itemSlideContainer: {
    height: Mixin.moderateSize(100),
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(16),
    padding: Mixin.moderateSize(16),
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: theme.colors?.primary,
    flex: 1,
    paddingHorizontal: Mixin.moderateSize(16),
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    justifyContent: 'flex-end',
    paddingBottom: Mixin.moderateSize(16),
  },
  headerContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: Mixin.moderateSize(68),
    height: Mixin.moderateSize(68),
    borderRadius: Mixin.moderateSize(34),
  },
  iconBg: {
    width: Mixin.moderateSize(150),
    height: Mixin.moderateSize(60),
    position: 'absolute',
    right: 20,
    bottom: 0,
  },
  nameContainer: {
    backgroundColor: '#00659F',
    paddingHorizontal: Mixin.moderateSize(8),
    borderRadius: Mixin.moderateSize(4),
  },
  paginationDotStyle: {
    width: Mixin.moderateSize(6),
    height: Mixin.moderateSize(6),
    backgroundColor: theme.colors?.primary,
  },
  paginationContainer: {
    justifyContent: 'flex-start',
    paddingTop: Mixin.moderateSize(18),
    paddingBottom: Mixin.moderateSize(20),
  },
  menuContainer: {
    padding: Mixin.moderateSize(16),
  },
  menuAbove: {
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(12),
  },
  menuBelow: {
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(12),
    marginTop: Mixin.moderateSize(12),
  },
  itemCreateSlide: {
    height: Mixin.moderateSize(100),
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(16),
    width: Mixin.moderateSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Mixin.moderateSize(8),
  },
  viewCamera: {
    position: 'absolute',
    bottom: Mixin.moderateSize(-4),
    right: 0,
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(100),
    padding: Mixin.moderateSize(6),
  },
  overlay: {
    position: 'absolute',
    width: '95%',
    bottom: Mixin.moderateSize(24),
    borderRadius: Mixin.moderateSize(8),
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balance: {
    fontWeight: 'bold',
  },
  upgradeVipContainer: {
    width: '100%',
    height: Mixin.moderateSize(45),
    backgroundColor: '#031B5A',
    paddingVertical: Mixin.moderateSize(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  upgradeVipLeftView: {
    width: '50%',
    height: Mixin.moderateSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Mixin.moderateSize(10),
  },
  upgradeVipRightView: {
    width: '40%',
    height: Mixin.moderateSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Mixin.moderateSize(10),
    justifyContent: 'flex-end',
  },
  btpUpgrade: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFB800',
    borderWidth: Mixin.moderateSize(1),
    borderRadius: Mixin.moderateSize(20),
  },
  iconGold: {
    margin: Mixin.moderateSize(8),
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
  },
  goldText: {
    fontSize: Mixin.moderateSize(16),
    color: '#FFC700',
    fontWeight: '600',
  },
  btnLogoutContainer: {
    width: '100%',
    height: Mixin.moderateSize(50),
    backgroundColor: theme.colors?.primary,
    marginVertical: Mixin.moderateSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Mixin.moderateSize(10),
  },
  largeText: {
    fontSize: Mixin.moderateSize(14),
    color: 'white',
    fontWeight: '700',
  },
  normalText: {
    fontSize: Mixin.moderateSize(14),
    fontWeight: '400',
    color: '#848688',
  },
  bottomViewContainer: {
    width: '100%',
    height: Mixin.moderateSize(50),
    marginVertical: Mixin.moderateSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: Mixin.moderateSize(10),
    marginBottom: Mixin.moderateSize(50),
    height: Mixin.moderateSize(16),
    paddingHorizontal: Mixin.moderateSize(16),
  },
  dot: {
    borderRadius: Mixin.moderateSize(6),
    backgroundColor: theme.colors?.primary,
    marginHorizontal: Mixin.moderateSize(16) / 2,
  },
  logoContainer: {
    width: '90%',
    backgroundColor: 'transparent',
    height: Mixin.moderateSize(50),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: Mixin.moderateSize(3),
    paddingHorizontal: Mixin.moderateSize(16),
  },
  smallText: {
    fontSize: Mixin.moderateSize(12),
    marginTop: Mixin.moderateSize(8),
    color: theme.colors?.white,
  },
  logo: {
    height: Mixin.moderateSize(30),
    width: Mixin.moderateSize(120),
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
