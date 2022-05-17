import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    position: 'absolute',
    bottom: Mixin.moderateSize(24),
  },
  inputContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    flex: 1,
    marginVertical: Mixin.moderateSize(16),
    marginTop: -50,
  },
}));
