import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IReceiver} from 'models/IReceiver';
import {IUser} from 'models/IUser';

export interface ITransferRequest extends IBaseRequest {
  toAccountNumber: string;
  amount: string;
  content: string;
}
export interface ICheckSubRequest extends IBaseRequest {
  accountNumber: string;
}
export interface ICheckSubResponse extends IBaseResponse {
  accountNumber: string;
  accountName: string;
}
export interface ITransactionFavoriteRequest extends IBaseRequest {
  transId: string;
  featureCode: string;
  favorite: number;

}

export interface ITransferConfirmRequest extends IBaseRequest {
  transId: string;
  pin: string;
}
export interface ITransferConfirmOTPRequest extends IBaseRequest {
  transId: string;
  otp: string;
  favorite: number;
}
export interface ITransferResponse extends IBaseResponse {
  fee: string;
  amount: string;
  currency: string;
  currencyCode: string;
  content: string;
  balance?: string;
  receiver?: IReceiver;
  refId?: string;
  totalAmount?: string;
  transactionTime?: string;
  transferData?:string;
}
