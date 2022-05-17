import {IBaseRequest} from 'models/IBaseRequest';
import {IBaseResponse} from 'models/IBaseResponse';
import {IPaginationRequest, IPaginationResponse} from './IPagination';

export interface INotificationsRequest extends IPaginationRequest {
  type: string;
}

export interface IReadNotificationRequest extends IBaseRequest {
  id: number;
  refId: string;
}

export interface IReadAllNotificationRequest extends IBaseRequest {
  type: string;
}

export interface IReadNotificationResponse extends IBaseResponse {
  totalNumberUnread: number;
}

export interface INotificationResponse extends IBaseResponse {
  totalNumberUnread: number;
  messages: IPaginationResponse<INotification>;
}
export interface INotification {
  title: string;
  createTime: number;
  clientType: number;
  id: number;
  refId: string;
  shortContent: string;
  fullContent: string;
  notificationType: number;
  status: number;
}
