import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IUser} from 'models/IUser';

export interface ILoginRequest extends IBaseRequest {
  accountNumber: string;
  pin: string;
}
export interface ILoginOTPRequest extends IBaseRequest {
  transId: string;
  otp: string;
  deactiveOthersDevice: boolean | number;
}
export interface ILoginResponse extends IBaseResponse {
  userInfo?: IUser;
  refreshToken?: string;
  accessToken?: string;
  device?: string;
  loginToken?: string;
  pin?: string;
  url?:string;
}
