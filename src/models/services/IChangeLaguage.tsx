import {IBaseResponse} from 'models/IBaseResponse';

export interface IChangeLanguageResponse extends IBaseResponse {
  language: string;
  description: string;
}
