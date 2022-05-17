import { Mixin } from 'helpers';
import { device_height } from 'helpers/Mixin';
import { makeStyles } from 'react-native-elements';

export default makeStyles(theme => ({
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    position: 'absolute',
    bottom: Mixin.moderateSize(30),
  },
  inputContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    flex: 1,
    marginVertical: Mixin.moderateSize(16),
  },
  titleContainer: {
    width: '100%',
    backgroundColor: '#E8F6FF',
    paddingHorizontal: Mixin.moderateSize(16),
    justifyContent: 'center',
    paddingVertical: Mixin.moderateSize(10),
  },
  txtTitle: {
    color: '#00659F',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: Mixin.moderateSize(12),
    marginTop: 0,
  },
  resend: {
    color: theme.colors?.primary,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  bodyModal: {
    width: '100%',
    alignItems: 'center',
  },
  otpInput: {
    width: '90%',
    marginVertical: Mixin.moderateSize(5),
  },
  viewPrimary: {
    height: device_height / 2,
    backgroundColor: theme.colors?.primary,
    position: 'absolute',
    top: 0,
    zIndex: -1,
    width: '100%',
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
