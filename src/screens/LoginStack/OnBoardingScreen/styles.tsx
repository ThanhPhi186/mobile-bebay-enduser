import {Mixin} from 'helpers';
import {Platform} from 'react-native';
import {makeStyles} from 'react-native-elements';

export default makeStyles(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors?.white,
  },
  imageAndTextContainer: {
    width: Mixin.device_width,
  },
  dotsRootContainer: {
    position: 'absolute',
    bottom: Mixin.device_height > 700 ? '10%' : '5%',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Mixin.moderateSize(10),
    marginBottom: Mixin.moderateSize(50),
    height: Mixin.moderateSize(16),
  },
  dot: {
    borderRadius: Mixin.moderateSize(6),
    backgroundColor: theme.colors?.primary,
    marginHorizontal: Mixin.moderateSize(16) / 2,
  },
  btnSkip: {
    position: 'absolute',
    top: Mixin.moderateSize(Platform.OS === 'ios' ? 36 : 20),
    width: Mixin.moderateSize(100),
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    borderRadius: Mixin.moderateSize(16),
    paddingHorizontal: Mixin.moderateSize(16),
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: Mixin.device_height / 7,
    paddingHorizontal: Mixin.moderateSize(16),
  },
  txtDescription: {
    textAlign: 'center',
    marginTop: Mixin.moderateSize(16),
    fontSize: Mixin.moderateSize(14),
  },
  txtTitle: {
    color: theme.colors?.black,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: Mixin.moderateSize(24),
  },
  txtButton: {
    color: theme.colors?.white,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(16),
  },
  bottomView: {
    paddingHorizontal: Mixin.moderateSize(16),
    position: 'absolute',
    bottom: Mixin.moderateSize(30),
    width: '100%',
  },
  image: {
    width: Mixin.moderateSize(220),
    height: Mixin.moderateSize(220),
    marginVertical: Mixin.moderateSize(20),
  },
}));
