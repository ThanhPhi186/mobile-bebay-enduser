import {EncryptHelper} from 'helpers';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import ChangePinService from 'services/ChangePinService';

export const useChangePinServices = () => {
  const {showLoading, hideLoading} = useBaseHook();
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const onVerifyChangePin = async (otp: string, transId: string) => {
    showLoading();
    const signature = await EncryptHelper.encryptSha256(
      `${otp}${transId}`,
      authenticationReducer.signatureKey!,
    );
    const response = await ChangePinService.verify({otp, transId, signature});
    hideLoading();
    if (response?.succeeded && !response.failed) {
      return {
        message: null,
        success: true,
        data: response.data,
      };
    } else {
      return {
        message: response?.data?.message,
        success: false,
        data: response?.data,
      };
    }
  };
  const onChangePin = async (pin: string, pinNew: string) => {
    showLoading();
    const signature = await EncryptHelper.encryptSha256(
      `${pin}${pinNew}`,
      authenticationReducer.signatureKey!,
    );
    const response = await ChangePinService.confirm({
      pin,
      pinNew,
      signature,
    });
    hideLoading();
    if (response?.succeeded && !response.failed) {
      return {
        message: null,
        success: true,
        data: response.data,
      };
    } else {
      return {
        message: response?.data?.message,
        success: false,
        data: response?.data,
      };
    }
  };
  return {onChangePin, onVerifyChangePin};
};
