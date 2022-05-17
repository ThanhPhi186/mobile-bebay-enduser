import {CurrencyHelper, EncryptHelper} from 'helpers';
import {
  IBillConfirmRequest,
  IBillOTPRequest,
  IBillInfoRequest,
  IBillCheckRequest,
  IBillResponse,
} from 'models/services/IBill';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import BillServices from 'services/BillServices';

export const useBill = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();
  const onBillInfo = async (msisdn: string) => {
    showLoading();
    const text = `${msisdn}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IBillInfoRequest = {
      signature,
      msisdn: msisdn,
    };

    const response = await BillServices.checkBillInfo(params);
    hideLoading();
    return response;
  };

  const onCheckBill = async (
    msisdn: string,
    amount: string,
    transId: string,
  ) => {
    showLoading();
    const text = `${transId}${msisdn}${amount}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IBillCheckRequest = {
      signature,
      msisdn: msisdn,
      amount: amount,
      transId: transId,
    };

    const response = await BillServices.billCheck(params);
    hideLoading();
    return response;
  };

  const onRequestPin = async (pin: string, transId: string) => {
    const text = `${transId}${pin}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IBillConfirmRequest = {
      signature,
      pin: pin,
      transId: transId,
    };

    const requestPinResponse = await BillServices.billConfirm(params);

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
    const params: IBillOTPRequest = {
      signature,
      otp: otp,
      transId: transId,
    };
    const requestOTPResponse = await BillServices.billVerifyOTP(params);
    hideLoading();
    if (requestOTPResponse?.succeeded && requestOTPResponse.data) {
      return requestOTPResponse;
    } else {
      return requestOTPResponse;
    }
  };

  return {onBillInfo, onCheckBill, onRequestPin, onRequestOTP};
};
