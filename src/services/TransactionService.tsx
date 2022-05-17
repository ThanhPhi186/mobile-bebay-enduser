import {
  ITransactionDetailRequest,
  ITransactionListResponse,
  ITransactionListSRequest,
  ITransactionDetailResponse
} from 'models/services/ITransaction';
import {BaseApiService} from './BaseApiService';

const url = '/history';
class TransactionService extends BaseApiService {
  public getTransactionService = () =>
    this.get<ITransactionListResponse>(`${url}/get-all-service`);
  public getListTransaction = (body: ITransactionListSRequest) =>
    this.post<ITransactionListSRequest, ITransactionListResponse>(
      `${url}/list-transaction`,
      body,
    );
    public getTransactionDetail = (body: ITransactionDetailRequest) =>
    this.post<ITransactionDetailRequest, ITransactionDetailResponse>(
      `/notification/transaction-detail`,
      body,
    ); 
}

export default new TransactionService();
