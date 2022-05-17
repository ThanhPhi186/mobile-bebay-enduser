import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
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
    marginTop: 10,
    justifyContent: 'space-between',
  },
  txtRecent: {
    color: '#545456',
    fontSize: 14,
    marginTop: 0,
    fontWeight: '600',
  },
  txtViewALl: {
    color: theme.colors?.primary,
    fontSize: 14,
    marginTop: 0,
    fontWeight: '500',
  },
  icon: {
    width: Mixin.moderateSize(35),
    height: Mixin.moderateSize(35),
  },
  buttonContact: {
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
    position: 'absolute',
    right: Mixin.moderateSize(20),
    top: Mixin.moderateSize(20),
    zIndex: 100,
  },
  titleContainer: {
    width: '100%',
    backgroundColor: '#E8F6FF',
    paddingHorizontal: Mixin.moderateSize(26),
    // justifyContent: 'center',
    paddingVertical: Mixin.moderateSize(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTitle: {
    color: '#00659F',
    fontWeight: '700',
    fontSize: Mixin.moderateSize(12),
    marginTop: 0,
    width: '85%',
  },
  WarningBalanceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconWarning: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    marginVertical: Mixin.moderateSize(20),
  },
}));
