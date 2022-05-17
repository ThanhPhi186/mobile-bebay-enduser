import {
  IWithdrawInfoRequest,
  IWithdrawOTPRequest,
  IWithdrawPinRequest,
  IWithdrawResponse,
} from 'models/services/IWithDraw';
import {BaseApiService} from './BaseApiService';

const url = '/cashOut';
class WithdrawService extends BaseApiService {
  public withdrawInfo = (body: IWithdrawInfoRequest) =>
    this.post<IWithdrawInfoRequest, IWithdrawResponse>(`${url}/info`, body);

  public withdrawPin = (body: IWithdrawPinRequest) =>
    this.post<IWithdrawPinRequest, IWithdrawResponse>(`${url}/confirm`, body);

  public withdrawOTP = (body: IWithdrawOTPRequest) =>
    this.post<IWithdrawOTPRequest, IWithdrawResponse>(`${url}/verify`, body);
}
export default new WithdrawService();
