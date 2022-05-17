import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IReceiver} from 'models/IReceiver';

export interface IBillInfoRequest extends IBaseRequest {
  msisdn: string;
}
export interface IBillCheckRequest extends IBaseRequest {
  msisdn: string;
  transId: string;
  amount: string;
}

export interface IBillConfirmRequest extends IBaseRequest {
  pin: string;
  transId: string;
}
export interface IBillOTPRequest extends IBaseRequest {
  otp: string;
  transId: string;
}
export interface IBillResponse extends IBaseResponse {
  fee: string;
  amount: string;
  currency: string;
  currencyCode: string;
  content: string;
  balance?: string;
  receiver?: IReceiver;
  refId?: string;
  totalAmount?: string;
  transactionTime: string;
  otpMessage?: null;
  discount: string;
  receiversPhone: string;
  transactionCode?: string;
  time?: string;
  transferFrom?: string;
  description: string;
  carrier: string;
  debitAmountHTG?: string;
  debitAmountUSD?: string;
  service?: string;
  contractNo?: string;
  exchangeRate?: string;
  customerName?: string;
  customerNumber?: string;
}
