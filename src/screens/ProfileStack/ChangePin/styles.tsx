import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    padding: Mixin.moderateSize(16),
    justifyContent: 'center',
    // paddingTop: Mixin.moderateSize(40),
    flex: 1,
  },
  image: {
    height: Mixin.moderateSize(200),
  },
  titleContainer: {
    marginTop: Mixin.moderateSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Mixin.moderateSize(20),
  },
  iconLock: {
    width: Mixin.moderateSize(20),
    height: Mixin.moderateSize(20),
    marginRight: Mixin.moderateSize(8),
  },

  nextContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    bottom: Mixin.moderateSize(30),
    paddingHorizontal: Mixin.moderateSize(16),
    justifyContent: 'flex-end',
  },
}));
