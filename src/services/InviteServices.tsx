import {IBalanceResponse} from 'models/services/IBalance';
import {IHomeRequest, IHomeResponse} from 'models/services/IHome';
import {IInitDataRequest} from 'models/services/IInitData';
import {
  IInviteInfoRequest,
  IInviteInfoResponse,
  IInviteRequest,
  IInviteResponse,
  IShareLinkResponse,
} from 'models/services/IInvite';
import {BaseApiService} from './BaseApiService';
const url = '/load-contacts';
class InviteServices extends BaseApiService {
  public shareLink = () =>
    this.post<void, IShareLinkResponse>(`${url}/share-link`);
  public inviteInfo = (params: IInviteInfoRequest) =>
    this.post<IInviteInfoRequest, IInviteInfoResponse>(`${url}/info`, params);
  public invite = (params: IInviteRequest) =>
    this.post<IInviteRequest, IInviteResponse>(`${url}/invite`, params);
}

export default new InviteServices();
