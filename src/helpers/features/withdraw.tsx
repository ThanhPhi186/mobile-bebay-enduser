import {EncryptHelper} from 'helpers';

import {useAppSelector, useBaseHook} from 'helpers/hookHelper';

import {
  IWithdrawInfoRequest,
  IWithdrawOTPRequest,
  IWithdrawPinRequest,
} from 'models/services/IWithDraw';
import WithdrawService from 'services/WithdrawService';

export const useWithdraw = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();

  const onWithdrawInfo = async (agentCode: string, amount: string) => {
    showLoading();
    const text = `${agentCode}${amount}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IWithdrawInfoRequest = {
      signature,
      agentCode,
      amount,
    };
    const response = await WithdrawService.withdrawInfo(params);
    hideLoading();
    return response;
  };

  const onRequestPin = async (transId: string, pin: string) => {
    const text = `${transId}${pin}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IWithdrawPinRequest = {
      signature,
      transId,
      pin,
    };

    const requestPinResponse = await WithdrawService.withdrawPin(params);

    if (requestPinResponse?.succeeded && requestPinResponse.data) {
      return requestPinResponse;
    }
  };

  const onRequestOTP = async (transId: string, otp: string) => {
    const text = `${transId}${otp}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IWithdrawOTPRequest = {
      signature,
      otp,
      transId,
    };
    const requestOTPResponse = await WithdrawService.withdrawOTP(params);
    if (requestOTPResponse?.succeeded && requestOTPResponse.data) {
      return requestOTPResponse;
    } else {
      return requestOTPResponse;
    }
  };

  return {onWithdrawInfo, onRequestPin, onRequestOTP};
};
