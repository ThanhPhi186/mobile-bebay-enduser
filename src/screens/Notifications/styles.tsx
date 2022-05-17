import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingBottom: Mixin.moderateSize(100),
    // backgroundColor: 'white'
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: Mixin.moderateSize(8),
    borderBottomColor: theme.colors?.grey4,
    paddingLeft: Mixin.moderateSize(16),
    borderBottomWidth: 1,
  },
  unReadContainer: {
    backgroundColor: 'rgba(193,193,193,0.4)',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemContentContainer: {
    flex: 11,
  },
  icon: {
    width: Mixin.moderateSize(30),
    height: Mixin.moderateSize(30),
  },
  contentContainer: {
    backgroundColor: 'white',
    marginTop: 12,
    borderRadius: 16,
  },
  viewTopContent: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 16,
    borderColor: '#EEF0F4',
  },
  img: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  contentTransaction: {
    color: '#848688',
    ...Mixin.padding(8, 16, 8, 16),
    lineHeight: 28,
    fontSize: Mixin.moderateSize(12),
  },
  titleTopContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  txtTransactionType: {
    fontSize: Mixin.moderateSize(14),
    fontWeight: '600',
  },
  TIDCode: {
    color: '#848688',
    fontSize: Mixin.moderateSize(12),
    marginTop: 12,
  },
  txtTimeTransaction: {
    color: '#848688',
    fontSize: Mixin.moderateSize(12),
  },
  reduceMoney: {
    fontSize: 16,
    fontWeight: '600',

    marginTop: 12,
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
  viewUnRead: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}));
