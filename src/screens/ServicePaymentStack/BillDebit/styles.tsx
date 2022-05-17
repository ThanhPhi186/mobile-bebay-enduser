import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    padding: Mixin.moderateSize(16),
    width: '100%',
  },
  bottomView: {
    width: '100%',
    height: Mixin.moderateSize(15),
    backgroundColor: theme.colors?.backgroundItem,
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
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    // position: 'absolute',
    marginVertical: Mixin.moderateSize(30),
  },
  info: {
    marginVertical: Mixin.moderateSize(4),
  },
}));
