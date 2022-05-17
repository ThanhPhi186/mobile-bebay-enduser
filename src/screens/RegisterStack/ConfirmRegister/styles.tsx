import { Mixin } from 'helpers';
import { Platform } from 'react-native';
import { makeStyles, colors } from 'react-native-elements';

export default makeStyles(theme => ({
  imageBanner: {
    width: '100%',
    aspectRatio: 375 / 272,
  },
  accountInput: {
    marginTop: Mixin.moderateSize(10),
    width: '100%',
    backgroundColor: theme.colors?.backgroundItem,
  },
  container: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: Mixin.moderateSize(16),
    width: '100%',
    position: 'absolute',
    bottom: Mixin.moderateSize(30),
  },
  biometricText: {
    width: '100%',
    textAlign: 'center',
    marginTop: Mixin.moderateSize(24),
  },
  skipContainer: {
    position: 'absolute',
    top: Mixin.moderateSize(Platform.OS === 'ios' ? 36 : 8),
    right: Mixin.moderateSize(16),
  },

  alreadyAccountText: {
    textAlign: 'center',
    alignItems: 'flex-end',
  },
  alreadyContainer: {
    bottom: Mixin.moderateSize(60),
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  signUp: {
    color: theme.colors?.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemContainer: {
    ...Mixin.padding(8, 16, 8, 14),
    backgroundColor: theme.colors?.backgroundItem,
    borderRadius: Mixin.moderateSize(8),
    height: Mixin.moderateSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: Mixin.moderateSize(8),
    height: Mixin.moderateSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent:'space-between'
  },
  itemPassportContainer: {
    ...Mixin.padding(8, 16, 8, 14),
    backgroundColor: '#00659F',
    borderRadius: Mixin.moderateSize(8),
    height: Mixin.moderateSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  },
  IDLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(14),
    flex: 1,
    marginTop: Mixin.moderateSize(4),
    textAlignVertical: 'top',
    paddingVertical: 0,
    paddingLeft: 0,
  },
  groupBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118,118,128,0.12)',
    padding: 2,
    borderRadius: 8,
    marginBottom: 16,
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
}));
