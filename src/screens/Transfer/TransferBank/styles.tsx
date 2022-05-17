import { Mixin } from 'helpers';
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
  RecentView: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  txtRecent: {
    color: '#545456',
    fontSize: 14,
    marginTop: 0
  },
  txtViewALl: {
    color: '#F28230',
    fontSize: 14,
    marginTop: 0
  },
  contactContainer: {
    marginVertical: Mixin.moderateSize(5),
    width: '100%'
  }


}));