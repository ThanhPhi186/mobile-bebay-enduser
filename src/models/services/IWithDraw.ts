import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export interface IWithdrawInfoRequest extends IBaseRequest {
  agentCode: string;
  amount: string;
}

export interface IWithdrawPinRequest extends IBaseRequest {
  transId: string;
  pin: string;
}

export interface IWithdrawOTPRequest extends IBaseRequest {
  transId: string;
  otp: string;
}

export interface IWithdrawResponse extends IBaseResponse {
  otpMessage?: string;
  balance?: string;
  currency: string;
  currencyCode: string;
  amount: string;
  totalAmount: string;
  discount: string;
  fee: string;
  transactionCode: string;
  time?: string;
  transferFrom?: string;
  provider?: string;
  customerNumber?: string;
  commission?: string;
  tax?: string;
  phoneNumberAgent?: string;
}
