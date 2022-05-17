import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';
import GlobalStyles from 'utils/styles/GlobalStyles';

export default makeStyles(theme => ({
  background: {
    backgroundColor: theme.colors?.primary,
    height: Mixin.device_height / 3,
    borderBottomRightRadius: Mixin.moderateSize(32),
    borderBottomLeftRadius: Mixin.moderateSize(32),
    width: '100%',
  },

  qrContainer: {
    padding: Mixin.moderateSize(64),
    backgroundColor: 'white',
    ...GlobalStyles.shadow,
    borderRadius: Mixin.moderateSize(14),
    width: Mixin.moderateSize(Mixin.device_width - 128),
    height: Mixin.moderateSize(Mixin.device_width - 128),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 60,
    backgroundColor: 'rgba(225,225,225,0.4)',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
