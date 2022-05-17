import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export interface IQRScanRequest extends IBaseRequest {
  qrCode: string;
}
export interface IQRScanResponse extends IBaseResponse {
  accountInfo?: IScanAccountInfo;
  qrCodeType: QRCodeType;
}
export interface IScanAccountInfo {
  accountId: string;
  accountNumber: string;
  accountName: string;
}

export enum QRCodeType {
  CONSUMER = 'CONSUMER',
}
