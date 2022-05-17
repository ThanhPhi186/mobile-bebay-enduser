import { IBaseRequest } from 'models/IBaseRequest';
import { IBaseResponse } from 'models/IBaseResponse';

export interface ITransactionListSRequest extends IBaseRequest {
  transId: string;
  fromDate: string;
  toDate: string;
  transType: string;
  page: number;
}
export interface ITransactionDetailRequest extends IBaseRequest {
  transactionId: string;
}

export interface IListAllTransaction {
  transactionId: number;
  accountNumber: string;
  accountId: string;
  fullName: string;
  toAccountNumber: string;
  toAccountId: string;
  toFullName: string;
  amount: string;
  fee: string;
  discount: string;
  totalAmount: string;
  createDate: string;
  serviceCode?: string;
  partnerCode?: string;
  processCode: string;
  hourCreated: string;
  content: string;
  transactionName: string;
}

export interface ITransactionType {
  en: string;
  fr: string;
  ht: string;
}

export interface IProcessCodeList {
  processCode: string;
  processName: ITransactionType;
  serviceCode?: string;
  paymentCode?: string;
  partnerCode?: string;
}

export interface ITransactionTypeList {
  value: string;
  name: string;
  title: string;
}

export interface ITransProcessCodeGroupInfoList {
  groupId: number;
  groupCode: string;
  groupName: ITransactionType;
  processCodeList: Array<IProcessCodeList>;
  offset: number;
  limit: number;
}

export interface ITransactionListResponse extends IBaseResponse {
  balance?: string;
  currency: string;
  currencyCode: string;
  transProcessCodeGroupInfoList?: Array<ITransProcessCodeGroupInfoList>;
  transactionHistoryResponses?: string;
  listAllTransaction: Array<IListAllTransaction>;
  transactionType?: ITransactionType;
  historyResponsesList?: string;
  transactionTypeList?: Array<ITransactionTypeList>;
}

export interface ITransactionDetailResponse extends IBaseResponse {
  accountNumber: string;
  amount: string;
  amountDetail: string;
  content: string;
  discount: string;
  fee: string;
  fullName: string;
  provider: string;
  service: string;
  tax: string;
  toAccountNumber: string;
  toFullName: string;
  totalAmount: string;
  totalRecords: string;
  transType: string;
  transactionId: number;
  transactionName: string;
}
