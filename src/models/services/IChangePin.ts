import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export interface IChangePinRequest extends IBaseRequest {
  pin: string;
  pinNew: string;
}
export interface IChangePinResponse extends IBaseResponse {}

export interface IVerifyChangePinRequest extends IBaseRequest {
  otp: string;
  transId: string;
}
export interface IVerifyChangePinResponse extends IBaseResponse {}
