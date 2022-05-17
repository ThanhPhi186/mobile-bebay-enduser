import remoteConfig from '@react-native-firebase/remote-config';
import {IAppConfig} from 'models/IAppConfig';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {AppActions} from 'stores/actions';
import database from '@react-native-firebase/database';
import {useAppSelector} from './hookHelper';

export const useServerDown = () => {
  const appConfig = useAppSelector(state => state.AppReducer.appConfig);
  const dispatch = useDispatch();

  useEffect(() => {
    const serverDownChange = database()
      .ref('/appConfigs/isServerDown')
      .on('value', snapshot => {
        console.log('SERVER DOWN', snapshot.val());
        dispatch(AppActions.setServerDown.request(snapshot.val()));
      });
    return () =>
      database().ref(`/appConfigs/isServerDown`).off('value', serverDownChange);
  }, []);
};

export const useRemoteConfig = () => {
  const [remoteDone, setRemoteDone] = useState(false);
  const app = useAppSelector(state => state.AppReducer.appConfig);
  const dispatch = useDispatch();

  const fetchOnly = async () => {
    await remoteConfig().setDefaults({
      api_test: '123',
    });
    await remoteConfig().fetch(0);
    const activated = await remoteConfig().activate();
    if (!activated) console.log('Remote Config not activated');

    const publicRsa = remoteConfig().getValue('public_rsa').asString();
    const natcash_url_en = remoteConfig().getValue('natcash_url_en').asString();
    const natcash_url_fr = remoteConfig().getValue('natcash_url_fr').asString();
    const natcash_url_ht = remoteConfig().getValue('natcash_url_ht').asString();
    const termofuse_url_en = remoteConfig()
      .getValue('natcash_register_termofuse_url_en')
      .asString();
    const termofuse_url_fr = remoteConfig()
      .getValue('natcash_register_termofuse_url_fr')
      .asString();
    const termofuse_url_ht = remoteConfig()
      .getValue('natcash_register_termofuse_url_ht')
      .asString();
    const feeandlimit_url_en = remoteConfig()
      .getValue('feeandlimit_url_en')
      .asString();
    const feeandlimit_url_fr = remoteConfig()
      .getValue('feeandlimit_url_fr')
      .asString();
    const feeandlimit_url_ht = remoteConfig()
      .getValue('feeandlimit_url_ht')
      .asString();

    dispatch(
      AppActions.setConfig.request({
        publicRsa,
        natcash_url_en,
        natcash_url_fr,
        natcash_url_ht,
        termofuse_url_en,
        termofuse_url_fr,
        termofuse_url_ht,
        feeandlimit_url_en,
        feeandlimit_url_fr,
        feeandlimit_url_ht,
      }),
    );
  };

  const remoteFetch = async () => {
    setRemoteDone(false);
    fetchOnly();
    setRemoteDone(true);
  };

  return {remoteDone, remoteFetch, fetchOnly};
};
