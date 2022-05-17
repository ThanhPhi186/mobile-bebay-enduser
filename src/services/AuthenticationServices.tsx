import {
  ILoginOTPRequest,
  ILoginRequest,
  ILoginResponse,
} from 'models/services/ILogin';
import {BaseApiService} from './BaseApiService';
const url = '/auth';
class AuthenticationService extends BaseApiService {
  public login = (body: ILoginRequest) =>
    this.post<ILoginRequest, ILoginResponse>(`${url}/login`, body);
  public loginOtp = (body: ILoginOTPRequest) =>
    this.post<ILoginOTPRequest, ILoginResponse>(`${url}/login-otp`, body);
  public logout = () => this.post(`${url}/logout`);
}

export default new AuthenticationService(false);
