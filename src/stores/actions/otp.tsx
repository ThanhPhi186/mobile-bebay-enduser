import {ReduxHelper} from 'helpers';
import {IAppConfig} from '../../models/IAppConfig';

export const prefix = 'OTP';
export const setOTPConfig = ReduxHelper.generateLocalAction<{
  transId: string;
  featureCode: string;
  otpMessage?: string;
}>(prefix, 'SET_OTP_CONFIG');
