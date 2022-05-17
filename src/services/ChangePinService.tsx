import {
  IChangePinRequest,
  IChangePinResponse,
  IVerifyChangePinRequest,
  IVerifyChangePinResponse,
} from 'models/services/IChangePin';
import {BaseApiService} from './BaseApiService';
const url = 'changePin';
class ChangePinService extends BaseApiService {
  public confirm = (body: IChangePinRequest) =>
    this.post<IChangePinRequest, IChangePinResponse>(`${url}/confirm`, body);
  public verify = (body: IVerifyChangePinRequest) =>
    this.post<IVerifyChangePinRequest, IVerifyChangePinResponse>(
      `${url}/verify`,
      body,
    );
}

export default new ChangePinService();
