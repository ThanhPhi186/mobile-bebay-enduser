import {  IRegisterCheckPhoneRequest, IConfirmOtpRequest, IRegisterConfirmRequest, IRegisterCheckPhoneResponse, IRegisterConfirmResponse} from 'models/services/IRegister';
import { } from '../models/services/ITransfer';
import { BaseApiService } from './BaseApiService';
const url = '/register';
class RegisterService extends BaseApiService {
  public checkAccountPhone = (body: IRegisterCheckPhoneRequest) =>
    this.post<IRegisterCheckPhoneRequest, IRegisterCheckPhoneResponse>(`${url}/check`, body);
    public confirmRegister = (body: IRegisterConfirmRequest) =>
    this.post<IRegisterConfirmRequest, IRegisterConfirmResponse>(`${url}/confirm`, body);
    public confirmOtp = (body: IConfirmOtpRequest) =>
    this.post<IConfirmOtpRequest, IRegisterCheckPhoneResponse>(`${url}/verify`, body);
}
export default new RegisterService(false);
