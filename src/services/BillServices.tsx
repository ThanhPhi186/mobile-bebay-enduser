import {
  IBillConfirmRequest,
  IBillOTPRequest,
  IBillInfoRequest,
  IBillResponse,
  IBillCheckRequest
} from 'models/services/IBill';
import { } from '../models/services/ITransfer';
import { BaseApiService } from './BaseApiService';
const url = '/bill';
class BillService extends BaseApiService {
  public checkBillInfo = (body: IBillInfoRequest) =>
    this.post<IBillInfoRequest, IBillResponse>(`${url}/info`, body);

  public billCheck = (body: IBillCheckRequest) =>
    this.post<IBillCheckRequest, IBillResponse>(`${url}/check`, body);

  public billConfirm = (body: IBillConfirmRequest) =>
    this.post<IBillConfirmRequest, IBillResponse>(`${url}/confirm`, body);

  public billVerifyOTP = (body: IBillOTPRequest) =>
    this.post<IBillOTPRequest, IBillResponse>(`${url}/verify`, body);
}
export default new BillService();
