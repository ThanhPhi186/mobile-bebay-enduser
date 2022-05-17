import {NativeModules, Platform} from 'react-native';
const {Keys} = NativeModules;
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';
export const getBuildKey = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    const key = await Keys.getKeyHash('SHA1');
    return key;
  } else {
    const key = DeviceInfo.getBundleId();
    return key;
  }
};
export const getDeviceId = (): string => {
  if (Platform.OS === 'android') {
    const deviceId = `${uuid.v4()}`.replace(/-/g, '');
    console.log(
      'deviceId SASA ====>',
      deviceId,
      DeviceInfo.getUniqueId().replace(/-/g, ''),
    );
    return deviceId;
  }
  return DeviceInfo.getUniqueId().replace(/-/g, '');
};
export const getDeviceModel = (): string => {
  return DeviceInfo.getDeviceId();
};
export const getOsName = (): string => {
  return Platform.OS;
};
export const getOsVersion = (): string => {
  return DeviceInfo.getSystemVersion();
};
export const getVersion = () => {
  return DeviceInfo.getVersion();
};
