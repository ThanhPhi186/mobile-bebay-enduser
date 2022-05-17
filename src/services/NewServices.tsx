import { INewRequest, INewResponse, PROMOTION_TAG, IPromotionDetailRequest, IPromotionDetailResponse } from 'models/services/INew';
import { BaseApiService } from './BaseApiService';
const url = '/news';
class NewService extends BaseApiService {
  public getNews = (page: number, promotionType: PROMOTION_TAG) =>
    this.post<INewRequest, INewResponse>(`${url}`, { page, promotionType });
  public getPromotionDetail = (body:IPromotionDetailRequest) =>
    this.post<IPromotionDetailRequest, IPromotionDetailResponse>(`${url}/getNewsById`, body);
}

export default new NewService(false);
