import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export interface IResendOTPRequest extends IBaseRequest {
  transId: string;
  featureCode: string;
}
export interface IResendOTPResponse extends IBaseResponse {}
