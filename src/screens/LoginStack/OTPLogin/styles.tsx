import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    flex: 1,
  },
  resend: {
    color: theme.colors?.primary,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  deactiveContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
}));
