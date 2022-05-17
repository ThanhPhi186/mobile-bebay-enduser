import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';
import GlobalStyles from 'utils/styles/GlobalStyles';

export default makeStyles(theme => ({
  referralContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: Mixin.moderateSize(16),
    ...GlobalStyles.shadow,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    paddingLeft: Mixin.moderateSize(8),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    borderRadius: Mixin.moderateSize(4),
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: Mixin.moderateSize(16),
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(8),
    marginTop: Mixin.moderateSize(8),
  },
  avaNameContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: Mixin.moderateSize(36),
    height: Mixin.moderateSize(36),
    borderRadius: Mixin.moderateSize(18),
  },
}));
