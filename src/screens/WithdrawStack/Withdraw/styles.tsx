import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  contentContainer: {
    ...Mixin.padding(20, 12, 0, 12),
    backgroundColor: '#E5E5E5',
    flex: 1,
    width: '100%',
  },
  btnCashOut: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: Mixin.moderateSize(16),
    borderRadius: Mixin.moderateSize(12),
  },
  viewIcon: {
    backgroundColor: '#F2F2F2',
    width: Mixin.moderateSize(48),
    height: Mixin.moderateSize(48),
    borderRadius: Mixin.moderateSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: Mixin.moderateSize(24),
    height: Mixin.moderateSize(24),
    resizeMode: 'contain',
  },
  viewTextTitle: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: Mixin.moderateSize(8),
  },
  btnToBank: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: Mixin.moderateSize(16),
    marginTop: Mixin.moderateSize(8),
    borderTopLeftRadius: Mixin.moderateSize(12),
    borderTopRightRadius: Mixin.moderateSize(12),
    marginBottom: 1,
  },
  containerListBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    paddingBottom: Mixin.moderateSize(16),
  },
  itemServiceContainer: {
    alignItems: 'center',
    marginTop: Mixin.moderateSize(12),
    width: '25%',
  },
  iconService: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
  },
  iconBank: {
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
    resizeMode: 'contain',
  },
  iconRight: {
    width: Mixin.moderateSize(14),
    height: Mixin.moderateSize(14),
    resizeMode: 'contain',
    marginLeft: Mixin.moderateSize(8),
  },
  description: {
    marginTop: Mixin.moderateSize(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
