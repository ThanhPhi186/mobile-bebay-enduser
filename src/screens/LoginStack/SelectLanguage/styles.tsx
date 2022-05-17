import {Mixin} from 'helpers';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    width: '100%',
    marginVertical: Mixin.moderateSize(20),
    marginTop: Mixin.moderateSize(100),
  },
  BoldText: {
    fontSize: Mixin.moderateSize(16),
    fontWeight: '700',
    color: theme.colors?.black,
  },
  normalText: {
    fontSize: Mixin.moderateSize(14),
    fontWeight: '600',
    color: theme.colors?.black,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors?.disabled,
    marginTop: Mixin.moderateSize(20),
    width: '45%',
    marginHorizontal: Mixin.moderateSize(10),
    height: Mixin.moderateSize(110),
    borderRadius: Mixin.moderateSize(10),
    borderWidth: Mixin.moderateSize(2),
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: theme.colors?.primary,
  },
  buttonContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    position: 'absolute',
    bottom: Mixin.moderateSize(30),
  },
  icon: {
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
  },
  contentView: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
  },
}));
