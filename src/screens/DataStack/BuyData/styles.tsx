import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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
});
