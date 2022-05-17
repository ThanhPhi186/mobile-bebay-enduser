import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export interface IGetListRecentRequest extends IBaseRequest {
  featureCode: string;
}

export interface IGetAllRecentRequest extends IBaseRequest {
  featureCode: string;
  type: string;
}

export interface IGetListRecentResponse extends IBaseResponse {
  recentTrans: IRecentTrans[];
  messageInfo: IMessageInfoTrans;
  data?: IDataAmountResponse[];
  introduction:IDataIntro[]
}

export interface IRecentTrans {
  id: number;
  tplAccountCode: string;
  tplAmount: string;
  tplContent: string;
  tplName?: string;
  recentTrans?: string;
}
export interface IDataIntro {
  image?: string;
  content?: Array<[]>;
  title?: string;
}
export interface IMessageInfoTrans {
  messageContent?: string;
  messageType?: string;
}

export interface IDataAmountResponse {
  groupId: number;
  amount: string;
  name: string;
}
