import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  shadow: {
    shadowColor: 'rgba(242 , 130, 48, 0.7);',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shadowGrey: {
    shadowColor: '#171717',
    shadowOffset: {width: 2, peak: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
