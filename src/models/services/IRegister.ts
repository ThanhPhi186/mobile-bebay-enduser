import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IUser} from 'models/IUser';


export interface IRegisterCheckPhoneRequest extends IBaseRequest {
  msisdn: string;
}
export interface IRegisterConfirmRequest extends IBaseRequest {
  transId:string;
  msisdn: string;
  fullName: string;
  dob: string;
  gender: number;
  paperType: number;
  idNo: string;
  referenceNumber: string;
  pin: string;
}
export interface IConfirmOtpRequest extends IBaseRequest {
  transId?: string;
  otp?: string;
}
export interface IRegisterCheckPhoneResponse extends IBaseResponse {
  transId?: string;
  otp?: string;
}
export interface IRegisterConfirmResponse extends IBaseResponse {
  msisdn: string;
  fullName: string;
  dob: string;
  gender: number;
  paperType: number;
  idNo: string;
  referenceNumber: string;
  pin: string;
}