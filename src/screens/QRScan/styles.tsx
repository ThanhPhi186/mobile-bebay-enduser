import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingTop: Mixin.moderateSize(16),
    paddingBottom: Mixin.moderateSize(16),
  },
  transactionContainer: {
    width: '100%',
    paddingVertical: Mixin.moderateSize(16),
    borderBottomColor: theme.colors?.grey4,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  scanner: {
    flex: 1,
    // height: Mixin.device_height,
    marginTop: Mixin.moderateSize(-100),
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 120,
    width: 200,
  },
}));
