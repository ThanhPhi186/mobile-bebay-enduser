import { Mixin } from 'helpers';
import { makeStyles } from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    flex:1, 
    backgroundColor:'white'
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
    justifyContent: 'space-between'
  },
  txtRecent: {
    color: '#545456',
    fontSize: 14,
    marginTop: 0,
    fontWeight: '600'
  },
  txtViewALl: {
    color: '#F28230',
    fontSize: 14,
    marginTop: 0,
    fontWeight: '600'
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
    zIndex: 100
  },
  bottomView: {
    width: '100%',
    height: Mixin.moderateSize(15),
    backgroundColor: theme.colors?.backgroundItem
  }


}));