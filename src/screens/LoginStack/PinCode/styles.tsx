import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
  },
}));
