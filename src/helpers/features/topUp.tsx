import {CurrencyHelper, EncryptHelper} from 'helpers';
import {
  ITopUpConfirmRequest,
  ITopUpOTPRequest,
  ITopUpRequest,
} from 'models/services/ITopUp';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import TopUpServices from 'services/TopUpServices';

export const useTopUp = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();

  const onGetListAmount = async () => {
    const response = await TopUpServices.getListAmount();

    return response;
  };

  const onCheckTopUp = async (msisdn: string, amount: string) => {
    showLoading();
    const text = `${msisdn}${amount}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITopUpRequest = {
      signature,
      msisdn: msisdn,
      amount,
    };
    const response = await TopUpServices.checkTopUp(params);
    hideLoading();
    return response;
  };

  const onRequestPin = async (pin: string, transId: string) => {
    const text = `${transId}${pin}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITopUpConfirmRequest = {
      signature,
      pin: pin,
      transId: transId,
    };

    const requestPinResponse = await TopUpServices.topUpConfirm(params);

    if (requestPinResponse?.succeeded && requestPinResponse.data) {
      return requestPinResponse;
    }
  };

  const onRequestOTP = async (otp: string, transId: string) => {
    showLoading();
    const text = `${transId}${otp}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITopUpOTPRequest = {
      signature,
      otp: otp,
      transId: transId,
    };
    const requestOTPResponse = await TopUpServices.topUpVerifyOTP(params);
    hideLoading();
    if (requestOTPResponse?.succeeded && requestOTPResponse.data) {
      return requestOTPResponse;
    } else {
      return requestOTPResponse;
    }
  };

  return {onCheckTopUp, onRequestPin, onRequestOTP, onGetListAmount};
};
