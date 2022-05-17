import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IReceiver} from 'models/IReceiver';

export interface IDataServiceRequest extends IBaseRequest {}

export interface ILanguage {
  en: string;
  fr: string;
  ht: string;
}

export interface IDataInfoRequest extends IBaseRequest {
  transId: string;
  serviceCode: string;
  packageCode: string;
}

export interface IDataConfirmRequest extends IBaseRequest {
  transId: string;
  pin: string;
}
export interface IDataOTPRequest extends IBaseRequest {
  transId: string;
  otp: string;
  toPhoneNumber: string;
}
export interface IDataResponse extends IBaseResponse {
  fee: string;
  amount: string;
  currency: string;
  currencyCode: string;
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
  packageName: string;
  language?: string;
  provider?: string;
  tax?: string;
}

export interface IPackageData {
  id: number;
  code: string;
  title: string;
  subTitle: ILanguage;
  description: ILanguage;
  value: number;
  icon: string;
  shortName: ILanguage;
  name: ILanguage;
  groupDataId: number;
}
export interface IBuyDataService {
  code: string;
  name: ILanguage;
  serviceCode: string;
  partnerCode: string;
  groupDataPackageInfoList: Array<IPackageData>;
}

export interface IDataServiceResponse extends IBaseResponse {
  currency: string;
  currencyCode: string;
  buyDataConfigs: IBuyDataService[];
}
