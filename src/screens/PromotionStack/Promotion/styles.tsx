import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';
import {isIphoneX} from 'react-native-iphone-x-helper';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    // padding: Mixin.moderateSize(16),
    paddingBottom: Mixin.moderateSize(isIphoneX() ? 100 : 120),
    backgroundColor: 'white',
    minHeight: Mixin.device_height - 100,
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    // height: 100,
    paddingVertical: Mixin.moderateSize(8),
    paddingHorizontal: Mixin.moderateSize(16),
  },
  imageItem: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
    borderRadius: Mixin.moderateSize(18),
  },
  contentItemContainer: {
    flex: 2.5,
    paddingLeft: Mixin.moderateSize(16),
  },
  itemTitle: {
    marginBottom: Mixin.moderateSize(8),
  },
  typesContainer: {
    width: '100%',
    backgroundColor: theme.colors?.backgroundItem,
    padding: Mixin.moderateSize(16),
    flexDirection: 'row',
    marginTop: Mixin.moderateSize(24),
  },
  typeSelectedTitle: {
    color: 'white',
  },
  selectedType: {
    backgroundColor: theme.colors?.primary,
  },
  typeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(5),
    padding: Mixin.moderateSize(8),
    marginHorizontal: Mixin.moderateSize(4),
  },
}));
