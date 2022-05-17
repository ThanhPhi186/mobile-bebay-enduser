import {ReduxHelper} from 'helpers';
import {IInviteInfoRequest, IInviteInfoResponse} from 'models/services/IInvite';

export const prefix = 'CONTACT';
export const getInfoInvite = ReduxHelper.generateActions<
  IInviteInfoRequest,
  IInviteInfoResponse
>(prefix, 'INFO_INVITE');
export const getInfoNotInvite = ReduxHelper.generateActions<
  IInviteInfoRequest,
  IInviteInfoResponse
>(prefix, 'INFO_NOT_INVITE');
export const invite = ReduxHelper.generateLocalAction<string>(prefix, 'INVITE');
