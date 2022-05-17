import {ICashInRequest, ICashInResponse} from 'models/services/ICashin';
import {BaseApiService} from './BaseApiService';

const url = '/cashIn';
class CashInService extends BaseApiService {
  public getListAgentLocation = (body: ICashInRequest) =>
    this.post<ICashInRequest, ICashInResponse>(`${url}/info`, body);
}
export default new CashInService();
