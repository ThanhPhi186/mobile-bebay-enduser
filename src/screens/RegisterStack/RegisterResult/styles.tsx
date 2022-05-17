import { Mixin } from 'helpers';
import { Platform } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { padding } from 'helpers/Mixin';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    position: 'absolute',
    bottom: Mixin.moderateSize(30),
  },
  icon: {
    width: Mixin.moderateSize(65),
    height: Mixin.moderateSize(65),
    tintColor: theme.colors?.primary
  },
  txtTitle:{
    fontWeight: '700',
    fontSize: Mixin.moderateSize(16),
    marginVertical:Mixin.moderateSize(10),
  }
}));
