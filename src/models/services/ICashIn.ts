import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IReceiver} from 'models/IReceiver';

export interface ICashInRequest extends IBaseRequest {
  lat: string;
  lon: string;
  distance: string;
}

export interface ICurrentLocation {
  latitude: number;
  longitude: number;
}

export interface IListAgentLocation {
  channelId: number;
  distance: number;
  name: string;
  agentCode: string;
  phone: string;
  latitude: number;
  longitude: number;
  country: string;
  province: string;
  district: string;
  address: string;
  contractNo?: string;
  areaCode: string;
}

export interface ICashInResponse extends IBaseResponse {
  currency: string;
  currencyCode: string;
  listAgentLocation: Array<IListAgentLocation>;
}
