import {StyleSheet} from 'react-native';

import {makeStyles} from 'react-native-elements';
import {Mixin} from 'helpers';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    height: Mixin.moderateSize(100),
    backgroundColor: theme.colors?.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BoldText: {
    fontSize: Mixin.moderateSize(24),
    color: theme.colors?.black,
    fontWeight: '700',
    marginVertical:20
  },
  normalText: {
    fontSize: Mixin.moderateSize(14),
    color: '#263238',
    fontWeight: '400',
    textAlign: 'center',
  },
}));
