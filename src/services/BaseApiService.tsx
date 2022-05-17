import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {KeysHelper} from 'helpers';
import _ from 'lodash';
import {FEATURE_CODE} from 'models/EFeatureCode';
import {IBaseResponse} from 'models/IBaseResponse';
import qs from 'qs';
import {cancel} from 'redux-saga/effects';
import {AuthenticationActions, OTPActions} from 'stores/actions';
import configureStore from 'stores/configurations/configureStore';
import {BASE_API_URL} from 'utils/Const';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';

export interface IApiResponse<T = void> {
  data?: T;
  header?: any;
  errors?: any;
  succeeded: boolean;
  failed?: boolean;
  error?: IApiError;
}
export interface IApiError {
  code?: string | number;
  message: string;
}
export interface IErrorResponse {
  error: string;
  error_description: string;
  error_uri: string;
}

const getFeatureCodeFromUrl = (url: string) => {
  if (url.includes('/login')) {
    return FEATURE_CODE.LOGIN;
  }
  if (url.includes('/bill')) {
    return FEATURE_CODE.BILL_MONEY;
  }
  if (url.includes('/buy-data')) {
    return FEATURE_CODE.DATA;
  }
  if (url.includes('/transfer')) {
    return FEATURE_CODE.TRANSFER_MONEY;
  }
  if (url.includes('/topUp')) {
    return FEATURE_CODE.TOP_UP_MONEY;
  }
  if (url.includes('changePin')) {
    return FEATURE_CODE.CHANGE_PIN;
  }
  if (url.includes('/register')) {
    return FEATURE_CODE.REGISTER;
  }
  if (url.includes('/cashOut')) {
    return FEATURE_CODE.CASHOUT;
  }
};
interface IApiRequestConfig extends AxiosRequestConfig {
  unProtected?: boolean;
}
// let BASE_API_URL = 'https://testeuapi.natcom.com.ht';
// if (__DEV__) {
//   BASE_API_URL = 'https://natcasheu.altek.com.vn';
// }

const API_CONFIG: AxiosRequestConfig = {
  // returnRejectedPromiseOnError: true,
  // withCredentials: true,
  timeout: 10000,
  baseURL: BASE_API_URL,
  headers: {
    'Content-type': 'application/json',
    'accept-language': 'en-Us',
    // timeOffset: Math.round(moment().utcOffset() / 60),
    accept: '*/*',
  },
  paramsSerializer: (params: any) => qs.stringify(params, {indices: false}),
};
export abstract class BaseApiService {
  private instance: AxiosInstance;
  private protectedApi: boolean;
  private controller = new AbortController();
  constructor(protectedApi = true) {
    this.instance = axios.create(API_CONFIG);
    this.protectedApi = protectedApi;
    this.instance.interceptors.request.use(this._handleRequest);
    this.instance.interceptors.response.use(
      response => {
        const config = response.config;
        const store = configureStore().store;
        const data = response.data as any;
        if (
          (config.method === 'post' || config.method === 'POST') &&
          !config.url?.includes('/otp/resend') &&
          data &&
          data.requireOtp &&
          data.transId &&
          getFeatureCodeFromUrl(config.url || '')
        ) {
          store.dispatch(
            OTPActions.setOTPConfig.request({
              transId: data.transId,
              featureCode: getFeatureCodeFromUrl(config.url || '')!,
              otpMessage: data.otpMessage,
            }),
          );
        }
        return response;
      },
      error => {
        if (error.response.status === 410) {
          const store = configureStore().store;
          if (
            store.getState().AuthenticationReducer.userInfo &&
            !store.getState().AuthenticationReducer.skipLogin
          ) {
            store.dispatch(AuthenticationActions.kickedOut.request());
          }
        }
        if (error.response.status === 401) {
          const store = configureStore().store;
          if (
            store.getState().AuthenticationReducer.userInfo &&
            !store.getState().AuthenticationReducer.skipLogin
          ) {
            store.dispatch(AuthenticationActions.logout.request());
          }
        }
        console.log('ASSADSDAA', error.response.status, error.response);
        throw new Error(error.response.data.message);
      },
    );
  }
  private getAccessToken = () => {
    const store = configureStore().store;
    const authenticationReducer = store.getState().AuthenticationReducer;
    if (_.isEmpty(authenticationReducer.accessToken)) {
      return authenticationReducer.initAccessToken;
    }
    if (_.isEmpty(authenticationReducer.loginToken)) {
      return authenticationReducer.accessToken;
    }
    return `${authenticationReducer.accessToken}##${authenticationReducer.loginToken}`;
  };
  private _handleRequest = (config: IApiRequestConfig): IApiRequestConfig => {
    try {
      const store = configureStore().store;
      const language = store.getState().LanguageReducer.language;
      const deviceId = store.getState().AppReducer.deviceId;
      const authorizationKey = this.getAccessToken();
      if (
        this.protectedApi &&
        !config.unProtected &&
        !store.getState().AuthenticationReducer.loginToken
      ) {
        this.controller.abort();
        const CancelToken = axios.CancelToken;
        return {
          ...config,
          cancelToken: new CancelToken(cancel => cancel('Protected API')),
        };
      }
      config.headers!.language = language;
      config.headers!['x-device-id'] = deviceId || '';
      config.headers!['x-app-version'] = KeysHelper.getVersion();
      // config.headers!['x-app-version'] = '1.1.4';

      config.headers!.Authorization = authorizationKey!;
      // handle for Resend OTP
      // if (
      //   (config.method === 'post' || config.method === 'POST') &&
      //   !config.url?.includes('/otp/resend') &&
      //   config.data.transId &&
      //   getFeatureCodeFromUrl(config.url || '')
      // ) {
      //   store.dispatch(
      //     OTPActions.setOTPConfig.request({
      //       transId: config.data.transId,
      //       featureCode: getFeatureCodeFromUrl(config.url || '')!,
      //     }),
      //   );
      // }
      return config;
    } catch (error) {
      throw new Error(error as string);
    }
  };
  private _handleResponse<T extends IBaseResponse>(
    response: AxiosResponse<T | IErrorResponse>,
  ): IApiResponse<T> {
    if (response.status === 200) {
      const data = response.data as T;
      if (data.code === 'MSG_SUCCESS') {
        return {
          data,
          header: response.headers,
          succeeded: true,
        };
      } else {
        return {
          data,
          header: response.headers,
          succeeded: true,
          failed: true,
        };
      }
    }
    const error = response.data as IErrorResponse;
    return {
      succeeded: false,
      error: {
        message: error.error_description,
      },
    };
  }

  private _handleError<T extends IBaseResponse>(): IApiResponse<T> {
    const data = {
      message: 'Network Error',
    } as T;
    const store = configureStore().store;
    const authenticationReducer = store.getState().AuthenticationReducer;
    const appReducer = store.getState().AppReducer;
    // analytics().logEvent('NETWORK_ERROR', {
    //   init: authenticationReducer.initAccessToken,
    //   access: authenticationReducer.accessToken,
    //   device: DeviceInfo.getModel(),
    //   publicRsa: appReducer.appConfig.publicRsa,
    //   deviceId: KeysHelper.getDeviceId,
    //   id: DeviceInfo.getBundleId(),
    // });
    return {
      succeeded: false,
      failed: true,
      error: {
        message: 'Network Error',
      },
      data,
    };
  }

  convertFormData(data: any) {
    var formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return formData;
  }

  public async get<T extends IBaseResponse>(
    url: string,
    config?: IApiRequestConfig,
  ) {
    try {
      const response = await this.instance.get<T>(`${url}`, config);
      console.log('url', url, response);
      return this._handleResponse<T>(response);
    } catch (error) {
      return this._handleError<T>();
    }
  }
  public async post<P, T extends IBaseResponse>(
    url: string,
    data?: P,
    config?: IApiRequestConfig,
  ) {
    try {
      const response = await this.instance.post<T>(`${url}`, data, config);
      console.log('url', url, response);
      return this._handleResponse<T>(response);
    } catch (error) {
      console.log('url error', url, error);
      return this._handleError<T>();
    }
  }
  public async put<P, T extends IBaseResponse>(
    url: string,
    data?: P,
    config?: IApiRequestConfig,
  ) {
    try {
      const response = await this.instance.put<T>(`${url}`, data, config);
      return this._handleResponse<T>(response);
    } catch (error) {}
  }
  public async delete<T extends IBaseResponse>(
    url: string,
    config?: IApiRequestConfig,
  ) {
    try {
      const response = await this.instance.get<T>(`${url}`, config);
      return this._handleResponse<T>(response);
    } catch (error) {
      return this._handleError<T>();
    }
  }
  public async postForm<P, T extends IBaseResponse>(
    url: string,
    data?: P,
    config?: IApiRequestConfig,
  ) {
    try {
      const formConfig: IApiRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const formData = this.convertFormData(data);
      const response = await this.instance.post<T>(
        `${url}`,
        formData,
        formConfig,
      );
      return this._handleResponse<T>(response);
    } catch (error) {
      return this._handleError<T>();
    }
  }
}
