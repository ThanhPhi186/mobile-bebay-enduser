import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    padding: Mixin.moderateSize(16),
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Mixin.moderateSize(18),
    marginBottom: Mixin.moderateSize(16),
  },
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    bottom: Mixin.moderateSize(30),
  },
}));
