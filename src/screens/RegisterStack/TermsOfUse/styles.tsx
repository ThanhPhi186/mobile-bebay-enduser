import { Mixin } from 'helpers';
import { Platform } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { padding } from 'helpers/Mixin';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    aspectRatio: 375 / 466,
    backgroundColor: "#00659F",
    paddingHorizontal: Mixin.moderateSize(16),
  },
  accountInput: {
    // marginTop: Mixin.moderateSize(-27),
    width: '100%',
  },
  inputContainer: {
    marginTop: Mixin.moderateSize(-30),
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
    width: '100%',
    textAlign: 'center',
    marginTop: Mixin.moderateSize(24),
  },
  skipContainer: {
    position: 'absolute',
    top: Mixin.moderateSize(Platform.OS === 'ios' ? 36 : 8),
    right: Mixin.moderateSize(16),
  },

  alreadyAccountText: {
    textAlign: 'center',
    alignItems: 'flex-end',
  },
  alreadyContainer: {
    bottom: Mixin.moderateSize(60),
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  signUp: {
    color: theme.colors?.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  txtTitle:{
     color: theme.colors?.white,
     fontSize: Mixin.moderateSize(18),
     fontWeight: "700", 
     marginTop: Mixin.moderateSize(20),
    }
}));
