import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IReceiver} from 'models/IReceiver';

export interface ITopUpRequest extends IBaseRequest {
  msisdn: string;
  amount: string;
}

export interface ITopUpConfirmRequest extends IBaseRequest {
  pin: string;
  transId: string;
}
export interface ITopUpOTPRequest extends IBaseRequest {
  otp: string;
  transId: string;
}
export interface ITopUpResponse extends IBaseResponse {
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
  tax?: string;
  amountToNatCom?: string;
  amountToNatComPromotion?: string;
}
export interface ITopUpAmountResponse extends IBaseResponse {
  fee: string;
  amount: string;
  currency: string;
  currencyCode: string;
  balance?: string;
  discount: string;
  refId?: string;
  otpMessage?: null;
  receiversPhone: string;
  transactionCode?: string;
  totalAmount?: string;
  transferFrom?: string;
  description?: string;
  tax?: string;
  receive?: string;
  amountConfig: {
    amountList: {
      [key: string]: string;
    };
  };
}
