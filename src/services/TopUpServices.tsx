import {
  ITopUpAmountResponse,
  ITopUpConfirmRequest,
  ITopUpOTPRequest,
  ITopUpRequest,
  ITopUpResponse,
} from 'models/services/ITopUp';
import {} from '../models/services/ITransfer';
import {BaseApiService} from './BaseApiService';
const url = '/topUp';
class TopUpService extends BaseApiService {
  public checkTopUp = (body: ITopUpRequest) =>
    this.post<ITopUpRequest, ITopUpResponse>(`${url}/Info`, body);

  public topUpConfirm = (body: ITopUpConfirmRequest) =>
    this.post<ITopUpConfirmRequest, ITopUpResponse>(`${url}/confirm`, body);

  public topUpVerifyOTP = (body: ITopUpOTPRequest) =>
    this.post<ITopUpOTPRequest, ITopUpResponse>(`${url}/verify`, body);

  public getListAmount = () =>
    this.get<ITopUpAmountResponse>(`${url}/get-amount`);
}
export default new TopUpService();
