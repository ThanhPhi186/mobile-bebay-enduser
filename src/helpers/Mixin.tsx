import {Dimensions} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
export const device_height = Dimensions.get('window').height;
export const device_width = Dimensions.get('window').width;
export function moderateSize(size: number, factor?: number) {
  return moderateScale(size, factor);
}
function dimensions(
  top: number,
  right = top,
  bottom = top,
  left = right,
  property: any,
) {
  let styles = {} as any;

  styles[`${property}Top`] = moderateSize(top);
  styles[`${property}Right`] = moderateSize(right);
  styles[`${property}Bottom`] = moderateSize(bottom);
  styles[`${property}Left`] = moderateSize(left);

  return styles;
}
export function margin(top: number, right = top, bottom = top, left = top) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top: number, right = top, bottom = top, left = top) {
  return dimensions(top, right, bottom, left, 'padding');
}
