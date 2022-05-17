import {EncryptHelper, KeysHelper} from 'helpers';
import {useAppSelector} from 'helpers/hookHelper';
import {useLoadingContext} from 'helpers/loadingHelper';
import {useRemoteConfig} from 'helpers/remoteConfig';
import _ from 'lodash';
import {IInitDataRequest} from 'models/services/IInitData';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AuthenticationActions} from 'stores/actions';
import {useGetFirebaseToken} from './appNotification';

export const useAppInIt = () => {
  const {remoteDone, remoteFetch} = useRemoteConfig();
  const [isDone, setIsDone] = useState(false);
  const {getToken} = useGetFirebaseToken();
  const initAccessToken = useAppSelector(
    state => state.AuthenticationReducer.initAccessToken,
  );
  const accessToken = useAppSelector(
    state => state.AuthenticationReducer.accessToken,
  );
  const appConfig = useAppSelector(state => state.AppReducer.appConfig);
  const dispatch = useDispatch();
  const deviceId = useAppSelector(state => state.AppReducer.deviceId);
  const getInitToken = async () => {
    const buildKey = await KeysHelper.getBuildKey();
    const publicRsa = appConfig?.publicRsa;
    const initAccessTokenNew = await EncryptHelper.encryptString(
      `${deviceId}##${buildKey}`,
      publicRsa!,
    );
    if (initAccessToken !== initAccessTokenNew) {
      dispatch(
        AuthenticationActions.setInitAccessToken.request(initAccessTokenNew),
      );
    }
  };
  const initData = async () => {
    await getInitToken();
    const token = await getToken();
    const initData: IInitDataRequest = {
      deviceModel: KeysHelper.getDeviceModel(),
      osName: KeysHelper.getOsName(),
      osVersion: KeysHelper.getOsVersion(),
      appVersion: KeysHelper.getVersion(),
      firebaseToken: token || '',
    };
    setTimeout(() => {
      dispatch(AuthenticationActions.initData.request(initData));
    }, 200);
  };
  useEffect(() => {
    if (remoteDone && appConfig.publicRsa) {
      if (!accessToken) {
        initData();
      }
      setIsDone(true);
    }
  }, [remoteDone, appConfig.publicRsa]);
  return {isDone, initData, remoteFetch};
};
