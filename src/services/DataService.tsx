import {
  IDataConfirmRequest,
  IDataInfoRequest,
  IDataOTPRequest,
  IDataResponse,
  IDataServiceResponse,
  IDataServiceRequest,
} from 'models/services/IData';
import {BaseApiService} from './BaseApiService';

const url = '/buy-data';
class DataService extends BaseApiService {
  public getDataService = () =>
    this.get<IDataServiceResponse>(`${url}/get-service`);

  public getDataInfo = (body: IDataInfoRequest) =>
    this.post<IDataInfoRequest, IDataResponse>(`${url}/info`, body);

  public dataConfirmPin = (body: IDataConfirmRequest) =>
    this.post<IDataConfirmRequest, IDataResponse>(`${url}/confirm`, body);

  public dataVerifyOTP = (body: IDataOTPRequest) =>
    this.post<IDataOTPRequest, IDataResponse>(`${url}/verify`, body);
}

export default new DataService();
