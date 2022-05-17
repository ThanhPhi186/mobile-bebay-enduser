import {IQRScanRequest, IQRScanResponse} from 'models/services/IQRScan';
import {BaseApiService} from './BaseApiService';
const url = '/qr';
class QRServices extends BaseApiService {
  public scan = (body: IQRScanRequest) =>
    this.post<IQRScanRequest, IQRScanResponse>(`${url}/scan`, body);
}

export default new QRServices();
