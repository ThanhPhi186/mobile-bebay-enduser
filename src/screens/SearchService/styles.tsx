import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemServiceContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '25%',
  },
  iconService: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    width: '90%',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    paddingBottom: 16,
  },
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    borderRadius: 12,
    height: Mixin.moderateSize(40),
    marginLeft: 12,
    paddingHorizontal: 12,
  },
  inputContainer: {
    backgroundColor: 'white',
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12,
  },
  viewBottomHeader: {
    height: 40,
    backgroundColor: 'white',
    marginTop: -20,
    zIndex: -1,
  },
});
