import { Mixin } from 'helpers';
import { Platform } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default makeStyles(theme => ({
  imageBanner: {
    width: '100%',
    aspectRatio: 375 / 466,
  },
  accountInput: {
    width: '100%',
  },
  inputContainer: {
    marginTop: isIphoneX() ? Mixin.moderateSize(-30) : Mixin.moderateSize(-50),
    paddingTop: Mixin.moderateSize(16),
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    borderTopLeftRadius: Mixin.moderateSize(24),
    borderTopRightRadius: Mixin.moderateSize(24),
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: Mixin.moderateSize(60),
  },
  biometricText: {
    textAlign: 'center',
    width:'50%',
    marginRight: Mixin.moderateSize(16),
  },
  skipContainer: {
    position: 'absolute',
    top: Mixin.moderateSize(Platform.OS === 'ios' ? 36 : 20),
    right: Mixin.moderateSize(-5),
    paddingVertical: Mixin.moderateSize(5),
    paddingHorizontal: Mixin.moderateSize(10),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Mixin.moderateSize(5),
  },

  alreadyAccountText: {
    textAlign: 'center',
    alignItems: 'flex-end',
  },
  alreadyContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  signUp: {
    color: theme.colors?.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
}));
