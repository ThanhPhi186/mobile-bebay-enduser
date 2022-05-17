import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import {showMessage, hideMessage} from 'react-native-flash-message';

export const useGetFirebaseToken = () => {
  // const [token, setToken] = useState<string | undefined>(undefined);
  // const [doneToken, setDoneToken] = useState(false);
  const {enabled} = useGetNotificationPermission();

  const getToken = async () => {
    if (enabled) {
      await messaging().registerDeviceForRemoteMessages();
      const token = await firebase.messaging().getToken();
      // setToken(token);
      // setDoneToken(true);
      return token;
    } else {
      return '';
    }
  };

  return {getToken};
};

export const useNotification = () => {
  const showNotification = async (
    title: string,
    body: string,
    onPress?: () => void,
  ) => {
    showMessage({
      message: title,
      description: body,
      onPress: () => {
        onPress && onPress();
      },
    });
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    // });
    // await notifee.displayNotification({
    //   title: title,
    //   body: body,
    //   android: {
    //     channelId,
    //   },
    // });
  };

  return {showNotification};
};

export const useGetNotificationPermission = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    getPermission();
  }, []);
  const getPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const isEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    setEnabled(isEnabled);
  };
  return {enabled};
};
