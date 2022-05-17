import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';

const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied', '', [
      {text: 'Go to Settings', onPress: openSetting},
    ]);
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "NatCash" to determine your location.`,
      '',
      [{text: 'Go to Settings', onPress: openSetting}],
    );
  }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasLocationPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    setTimeout(() => {
      SimpleToast.show('Location permission denied by user.', SimpleToast.LONG);
    }, 500);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    setTimeout(() => {
      SimpleToast.show(
        'Location permission revoked by user.',
        SimpleToast.LONG,
      );
    }, 500);
  }

  return false;
};

export default hasLocationPermission;
