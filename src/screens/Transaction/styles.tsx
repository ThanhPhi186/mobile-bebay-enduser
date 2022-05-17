import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';
import {theme} from 'utils/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: '95%',
    bottom: 24,
    borderRadius: 8,
    ...Mixin.padding(12, 8, 12, 8),
  },
  overlayDate: {
    position: 'absolute',
    width: '95%',
    bottom: 48,
    borderRadius: 8,
    ...Mixin.padding(32, 12, 24, 12),
  },
  btnChooseDay: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
  },
  btnChooseDayActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  rightHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DA742A',
    borderRadius: 8,
    padding: 8,
    marginTop: -4,
  },
  topContentContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Mixin.padding(12, 16, 12, 16),
  },
  txtTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6E9',
    borderRadius: 8,
    ...Mixin.padding(4, 8, 4, 8),
  },
  txtType: {
    color: theme.colors?.primary,
    marginRight: 4,
    fontWeight: 'bold',
    fontSize: Mixin.moderateSize(14),
  },
  groupBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118,118,128,0.12)',
    padding: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  contentContainerFlatlist: {
    paddingBottom: 120,
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
});
