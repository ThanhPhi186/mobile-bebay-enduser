import {Colors, FullTheme} from 'react-native-elements';
import {Mixin} from '../../helpers';
import {RecursivePartial} from './react-native-elements';
export const borderRadius = 8;

export const borderWidth = 1;

export const selectionColor = '#FF774D';

export const textColorDark2 = '#3D5E7B';

export const textColorDark3 = '#8AA3B9';

export const textColorWhite = '#FFFFFF';

export const textColorBlack = '#000000';

export const textColorGrey = '#979797';

export const bgGreyTransparent = 'rgba(173, 173, 173, 0.5)';
export interface IExtendColor extends Colors {
  testColor: string;
}
export const theme: Partial<FullTheme> = {
  Button: {
    titleStyle: {
      fontWeight: '600',
      fontSize: Mixin.moderateSize(14),
      lineHeight: 24,
      fontFamily: 'Inter',
    },
  },
  Text: {
    style: {
      fontFamily: 'Inter',
    },
  },
  Icon: {
    type: 'material-community',
  },
  Input: {
    selectionColor: selectionColor,
    placeholderTextColor: textColorDark3,
  },
  CheckBox: {
    iconType: 'material-community',
  },
  colors: {
    primary: '#FF0000',
    secondary: '#00659F',
    grey5: '#F6F9FC',
    grey1: '#AEAEB2',
    error: '#D70015',
    success: '#248A3D',
    inputAlternative: '#F0EDE9',
    backgroundItem: '#EEF0F4',
    disabledButton: '#DE8397',
  },
};
