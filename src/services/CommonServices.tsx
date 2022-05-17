import {
  IGetListRecentRequest,
  IGetListRecentResponse,
} from 'models/services/IRecent';
import {
  ICheckSubRequest,
  ICheckSubResponse,
  ITransferResponse,
  ITransactionFavoriteRequest,
} from 'models/services/ITransfer';
import {BaseApiService} from './BaseApiService';
class CommonService extends BaseApiService {
  public checkSub = (body: ICheckSubRequest) =>
    this.post<ICheckSubRequest, ICheckSubResponse>(`/check-sub`, body);
  public getListRecent = (body: IGetListRecentRequest) =>
    this.post<IGetListRecentRequest, IGetListRecentResponse>(
      `/feature-info`,
      body,
    );
  public transactionFavorite = (body: ITransactionFavoriteRequest) =>
    this.post<ITransactionFavoriteRequest, ICheckSubResponse>(
      `/transaction-favorite`,
      body,
    );

  public getAllRecent = (body: IGetListRecentRequest) =>
    this.post<IGetListRecentRequest, IGetListRecentResponse>(
      `/recent-all-transaction`,
      body,
    );
}

export default new CommonService();
