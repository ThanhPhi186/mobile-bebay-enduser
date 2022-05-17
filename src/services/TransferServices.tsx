import {
  ITransferRequest,
  ITransferResponse,
  ITransferConfirmRequest,
  ICheckSubRequest,
  ITransferConfirmOTPRequest,
  ICheckSubResponse,
} from '../models/services/ITransfer';
import {BaseApiService} from './BaseApiService';
const url = '/transfer';
class TransferService extends BaseApiService {
  public checkSub = (body: ICheckSubRequest) =>
    this.post<ICheckSubRequest, ICheckSubResponse>(`/check-sub`, body);
  public getTransferInformation = (body: ITransferRequest) =>
    this.post<ITransferRequest, ITransferResponse>(`${url}/info`, body);
  public transferConfirm = (body: ITransferConfirmRequest) =>
    this.post<ITransferConfirmRequest, ITransferResponse>(
      `${url}/confirm`,
      body,
    );
  public verifyOTP = (body: ITransferConfirmOTPRequest) =>
    this.post<ITransferConfirmOTPRequest, ITransferResponse>(
      `${url}/verify`,
      body,
    );
}
export default new TransferService();
