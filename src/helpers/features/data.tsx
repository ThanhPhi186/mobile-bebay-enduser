import {EncryptHelper} from 'helpers';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import DataService from 'services/DataService';
import {
  IDataConfirmRequest,
  IDataInfoRequest,
  IDataOTPRequest,
} from 'models/services/IData';
import {useLoadingContext} from 'helpers/loadingHelper';

export const useData = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useLoadingContext();

  const onGetDataService = async () => {
    const response = await DataService.getDataService();

    return response;
  };

  const onGetDataInfo = async (
    transId: string,
    serviceCode: string,
    packageCode: string,
  ) => {
    showLoading();
    const text = `${transId}${serviceCode}${packageCode}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IDataInfoRequest = {
      signature,
      transId,
      serviceCode,
      packageCode,
    };

    const response = await DataService.getDataInfo(params);
    hideLoading();

    if (response?.succeeded && response.data) {
      return response;
    }
  };

  const onRequestPin = async (transId: string, pin: string) => {
    const text = `${transId}${pin}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IDataConfirmRequest = {
      signature,
      transId,
      pin,
    };

    const requestPinResponse = await DataService.dataConfirmPin(params);

    if (requestPinResponse?.succeeded && requestPinResponse.data) {
      return requestPinResponse;
    }
  };

  const onRequestOTP = async (
    transId: string,
    otp: string,
    toPhoneNumber: string,
  ) => {
    const text = `${transId}${otp}${toPhoneNumber}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IDataOTPRequest = {
      signature,
      transId,
      otp,
      toPhoneNumber,
    };

    const requestOTPResponse = await DataService.dataVerifyOTP(params);
    if (requestOTPResponse?.succeeded && requestOTPResponse.data) {
      return requestOTPResponse;
    } else {
      return requestOTPResponse;
    }
  };

  return {onGetDataService, onGetDataInfo, onRequestPin, onRequestOTP};
};
