import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export enum EInviteType {
  INVITE = 'invite',
  NOT_INVITE = 'notInvite',
}

export interface IShareLinkResponse extends IBaseResponse {
  setReferralLink: string;
}
export interface IInviteInfoRequest extends IBaseRequest {
  msisdnArr: string;
  type: EInviteType;
}

export interface IInviteInfoResponse extends IBaseResponse {
  listPhoneNumberWithWallet?: string;
  listInviteNumber?: string;
  listNotAccountEWallet?: string;
}

export interface IInviteRequest extends IBaseRequest {
  msisdnArr: string;
}

export interface IInviteResponse extends IBaseResponse {}
