import {EncryptHelper} from 'helpers';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import {
  ITransferRequest,
  ITransferConfirmRequest,
  ICheckSubRequest,
  IGetListRecentRequest,
  ITransferConfirmOTPRequest,
} from 'models/services/ITransfer';
import AuthenticationServices from 'services/AuthenticationServices';
import TransferServices from 'services/TransferServices';
import {AuthenticationActions, TransferActions} from 'stores/actions';
export const useGetTransferInfo = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {dispatch, showLoading, hideLoading} = useBaseHook();
  const {navigation} = useGetNavigation();
  const onGetTransferInfo = async (
    amount: string,
    content: string,
    accountNumber: string,
  ) => {
    const text = `${accountNumber}${amount}${content}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITransferRequest = {
      signature,
      toAccountNumber: accountNumber,
      amount: amount,
      content: content,
    };
    const transferResponse = await TransferServices.getTransferInformation(
      params,
    );
    if (transferResponse?.succeeded && transferResponse.data) {
      hideLoading();
      return transferResponse;
    }
  };
  return {
    onGetTransferInfo,
  };
};

export const requestPin = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {dispatch, showLoading, hideLoading} = useBaseHook();
  const {navigation} = useGetNavigation();
  const onRequestPin = async (pin: string, transId: string) => {
    showLoading();
    const text = `${transId}${pin}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITransferConfirmRequest = {
      signature,
      pin: pin,
      transId: transId,
    };
    const requestPinResponse = await TransferServices.transferConfirm(params);
    hideLoading();
    if (requestPinResponse?.succeeded && requestPinResponse.data) {
      return requestPinResponse;
    }
  };
  return {
    onRequestPin,
  };
};

export const requestOTP = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {dispatch, showLoading, hideLoading} = useBaseHook();
  const onRequestOTP = async (
    otp: string,
    transId: string,
    favorite = false,
  ) => {
    showLoading();
    const text = `${transId}${otp}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITransferConfirmOTPRequest = {
      signature,
      otp: otp,
      transId: transId,
      favorite: favorite ? 2 : 0,
    };
    const requestOTPResponse = await TransferServices.verifyOTP(params);
    hideLoading();
    if (requestOTPResponse?.succeeded && requestOTPResponse.data) {
      return requestOTPResponse;
    } else {
      return requestOTPResponse;
    }
  };
  return {
    onRequestOTP,
  };
};
