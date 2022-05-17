import {IChangeLanguageResponse} from 'models/services/IChangeLaguage';
import {BaseApiService} from './BaseApiService';
class LanguageService extends BaseApiService {
  public changeLanguage = () =>
    this.get<IChangeLanguageResponse>(`change-language/confirm`);
}

export default new LanguageService(false);
