import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {INew} from 'models/INew';

export interface IHomeRequest extends IBaseRequest {}
export interface IHomeResponse extends IBaseResponse {
  greetingMessage?: string;
  hotNews: INew[];
  listNews: INew[];
  newAppVersion?: INewAppVersion;
}
export interface INewAppVersion {
  appVersion?: string;
  description?: string;
  appStoreUrl?: string;
  requireToUpgrade?: number;
  showDialogUpgrade?: number;
}
