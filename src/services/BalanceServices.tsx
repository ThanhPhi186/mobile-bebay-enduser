import {IBalanceResponse} from 'models/services/IBalance';
import {IHomeRequest, IHomeResponse} from 'models/services/IHome';
import {IInitDataRequest} from 'models/services/IInitData';
import {BaseApiService} from './BaseApiService';
const url = '/get-balance';
class BalanceService extends BaseApiService {
  public getBalance = () => this.get<IBalanceResponse>(`${url}`);
}

export default new BalanceService();
