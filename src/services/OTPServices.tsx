import {IBalanceResponse} from 'models/services/IBalance';
import {
  IResendOTPRequest,
  IResendOTPResponse,
} from 'models/services/IResendOtp';
import {BaseApiService} from './BaseApiService';
const url = '/otp';
class OTPService extends BaseApiService {
  public resend = (body: IResendOTPRequest) =>
    this.post<IResendOTPRequest, IResendOTPResponse>(`${url}/resend`, body);
}

export default new OTPService(false);
