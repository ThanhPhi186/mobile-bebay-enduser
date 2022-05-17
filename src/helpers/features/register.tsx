import {CurrencyHelper, EncryptHelper} from 'helpers';
import {
  IRegisterCheckPhoneRequest,
  IConfirmOtpRequest,
  IRegisterConfirmRequest,
  IRegisterCheckPhoneResponse,
  IRegisterConfirmResponse,
} from 'models/services/IRegister';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import RegisterService from 'services/RegisterService';

export const useRegister = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();

  const onCheckAccountPhone = async (msisdn: string) => {
    showLoading();
    const text = `${msisdn}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IRegisterCheckPhoneRequest = {
      // signature,
      msisdn,
    };
    const response = await RegisterService.checkAccountPhone(params);
    hideLoading();
    return response;
  };

  const onRegisterConfirm = async (dataRegister: IRegisterConfirmResponse) => {
    const text = `${dataRegister.transId}${dataRegister.msisdn}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IRegisterConfirmRequest = {
      signature,
      msisdn: dataRegister.msisdn,
      fullName: dataRegister.fullName,
      dob: dataRegister.dob,
      gender: dataRegister.gender,
      paperType: dataRegister.paperType,
      idNo: dataRegister.idNo,
      referenceNumber: dataRegister.referenceNumber,
      pin: dataRegister.pin,
      transId: dataRegister.transId!,
    };

    const requestRegisterResponse = await RegisterService.confirmRegister(
      params,
    );

    if (requestRegisterResponse?.succeeded && requestRegisterResponse.data) {
      return requestRegisterResponse;
    }
  };

  const onRequestOTP = async (otp: string, transId: string) => {
    showLoading();
    const text = `${transId}${otp}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IConfirmOtpRequest = {
      signature,
      otp: otp,
      transId: transId,
    };
    const requestOTPResponse = await RegisterService.confirmOtp(params);
    hideLoading();
    if (requestOTPResponse?.succeeded && requestOTPResponse.data) {
      return requestOTPResponse;
    } else {
      return requestOTPResponse;
    }
  };

  return {onCheckAccountPhone, onRegisterConfirm, onRequestOTP};
};
