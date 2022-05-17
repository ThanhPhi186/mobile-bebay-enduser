import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    flex: 1,
    marginTop: Mixin.moderateSize(16),
  },
  amountListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnAmount: {
    width: '31%',
    justifyContent: 'center',
    height: Mixin.moderateSize(40),
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
  },
  recentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
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
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    bottom: Mixin.moderateSize(30),
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
