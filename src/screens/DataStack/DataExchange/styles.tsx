import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerListService: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
  },
  viewService: {
    ...Mixin.padding(8),
    ...Mixin.margin(8, 0, 8, 12),
    borderRadius: 8,
  },
  columnWrapper: {
    marginTop: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  warningBalanceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconWarning: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    marginVertical: Mixin.moderateSize(20),
  },
});
