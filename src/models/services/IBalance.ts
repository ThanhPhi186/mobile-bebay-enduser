import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';

export interface IBalanceRequest extends IBaseRequest {}
export interface IBalanceResponse extends IBaseResponse {
  balance: string;
  accountId: string;
}
