import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Platform} from 'react-native';
import GlobalStyles from 'utils/styles/GlobalStyles';
import {makeStyles} from 'react-native-elements';
import {Mixin} from 'helpers';

export default makeStyles(theme => ({
  container: {
    flex: 1,
    paddingBottom: Mixin.moderateSize(80),
    backgroundColor: theme.colors?.white,
  },
  image: {
    height: Mixin.moderateSize(400),
    width: '100%',
  },
  avatar: {
    margin: Mixin.moderateSize(8),
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
    borderRadius: Mixin.moderateSize(25),
  },
  iconGold: {
    margin: Mixin.moderateSize(8),
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
  },
  iconEye: {
    marginLeft: Mixin.moderateSize(5),
    width: Mixin.moderateSize(15),
    height: Mixin.moderateSize(15),
  },
  smallText: {
    fontSize: Mixin.moderateSize(12),
    marginTop: Mixin.moderateSize(8),
    color: theme.colors?.white,
  },
  iconNotification: {
    width: Mixin.moderateSize(32),
    height: Mixin.moderateSize(32),
  },
  mediumText: {
    fontSize: Mixin.moderateSize(12),
    color: theme.colors?.white,
    fontWeight: '500',
    textAlign: 'center',
  },
  LargeText: {
    fontSize: Mixin.moderateSize(17),
    color: theme.colors?.white,
    fontWeight: '700',
  },
  logo: {
    height: Mixin.moderateSize(24),
    width: Mixin.moderateSize(102),
  },
  goldText: {
    fontSize: Mixin.moderateSize(16),
    color: '#FFC700',
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors?.white,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: theme.colors?.white,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: Mixin.moderateSize(20),
    width: '25%',
  },
  btnViewAllService: {
    width: '90%',
    height: Mixin.moderateSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(242,130,48,0.05)',
    alignSelf: 'center',
    borderRadius: Mixin.moderateSize(10),
    marginTop: Mixin.moderateSize(20),
  },
  CarouselContainer: {
    width: '100%',
    height:
      Platform.OS === 'ios' ? Mixin.moderateSize(120) : Mixin.moderateSize(100),
    paddingHorizontal: Mixin.moderateSize(20),
    // marginTop: HEADER_MAX_HEIGHT - 10,
    // zIndex: 1000,
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: Mixin.moderateSize(20),
  },
  userInfoContainer: {
    width: '70%',
    backgroundColor: 'transparent',
    height: Mixin.moderateSize(50),
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Mixin.moderateSize(3),
    flexDirection: 'row',
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
  balanceContainer: {
    width: '90%',
    height: Mixin.moderateSize(75),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: Mixin.moderateSize(15),
    padding: Mixin.moderateSize(10),
    marginVertical: Mixin.moderateSize(10),
    backgroundColor: theme.colors?.primary,
  },
  wrapBalance: {
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    height: Mixin.moderateSize(22),
    marginVertical: Mixin.moderateSize(3),
  },
  logoNatcash: {
    width: Mixin.moderateSize(70),
    height: 30,
  },

  bottomView: {
    ...GlobalStyles.shadow,
    width: '100%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerGold: {
    flexDirection: 'row',
    backgroundColor: theme.colors?.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: Mixin.moderateSize(32),
    borderRadius: 100,
    paddingHorizontal: Mixin.moderateSize(7),
    marginRight: Mixin.moderateSize(2),
  },
  imgCrownWhite: {
    width: Mixin.moderateSize(17),
    height: Mixin.moderateSize(17),
    resizeMode: 'contain',
  },
  txtUpgrade: {
    fontWeight: '600',
    fontSize: Mixin.moderateSize(10),
    marginLeft: 4,
  },
  viewCamera: {
    position: 'absolute',
    bottom: Mixin.moderateSize(4),
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
  WarningBalanceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconWarning: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    marginVertical: Mixin.moderateSize(20),
  },
}));
