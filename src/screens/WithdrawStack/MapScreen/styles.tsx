import {Mixin} from 'helpers';
import {StyleSheet} from 'react-native';
import {theme} from 'utils/styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    height: 32,
    width: '95%',
    position: 'absolute',
    top: 8,
    zIndex: 2,
    alignSelf: 'center',
    borderRadius: 8,
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
  box_control: {
    position: 'absolute',
    bottom: 24,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 2,
    alignSelf: 'center',
  },
  box_control_top: {
    padding: 10,
  },
  slider: {
    width: '100%',
  },
  textCon: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box_keyword: {
    borderTopWidth: 1,
    borderTopColor: '#CECECE',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnGps: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  containerImgMarker: {
    backgroundColor: 'rgba(242, 130, 48, 0.15)',
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    borderRadius: Mixin.moderateSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
