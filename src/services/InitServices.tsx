import {IInitDataRequest} from 'models/services/IInitData';
import {BaseApiService} from './BaseApiService';
const url = '/init-data';
class InitService extends BaseApiService {
  public getInitData = (body: IInitDataRequest) => {
    return this.post<any, any>(url, body);
  };
}

export default new InitService(false);
