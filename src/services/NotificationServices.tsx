import {
  INotificationResponse,
  INotificationsRequest,
  IReadAllNotificationRequest,
  IReadNotificationRequest,
  IReadNotificationResponse,
} from 'models/services/INotification';
import {BaseApiService} from './BaseApiService';
const url = '/notification';
class NotificationServices extends BaseApiService {
  public getNotifications = (page: number, type: string) =>
    this.post<INotificationsRequest, INotificationResponse>(`${url}/messages`, {
      page,
      type,
    });
  public readNotification = (body: IReadNotificationRequest) =>
    this.post<IReadNotificationRequest, IReadNotificationResponse>(
      `${url}/update-status`,
      body,
    );

  public readAllNotification = (body: IReadAllNotificationRequest) =>
    this.post<IReadAllNotificationRequest, IReadNotificationResponse>(
      `${url}/update-all-read`,
      body,
    );
}

export default new NotificationServices();
