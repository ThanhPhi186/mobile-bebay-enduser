import {IHomeRequest, IHomeResponse} from 'models/services/IHome';
import {BaseApiService} from './BaseApiService';
const url = '/home';
class HomeService extends BaseApiService {
  public getInfo = (body: IHomeRequest) =>
    this.post<IHomeRequest, IHomeResponse>(`${url}/info`, {});
}

export default new HomeService(false);
