import {EncryptHelper} from 'helpers';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import {ILoginRequest} from 'models/services/ILogin';
import AuthenticationServices from 'services/AuthenticationServices';
import {AuthenticationActions} from 'stores/actions';

export const useLogin = (onSuccess?: () => void) => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {dispatch, showLoading, hideLoading} = useBaseHook();
  const {navigation} = useGetNavigation();
  const onLogin = async (
    code: string,
    onFailure?: (message?: string) => void,
  ) => {
    showLoading();
    const text = `${authenticationReducer.accountNumber}${code}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );

    const params: ILoginRequest = {
      signature,
      pin: code,
      accountNumber: authenticationReducer.accountNumber!,
    };
    const loginResponse = await AuthenticationServices.login(params);
    console.log('RESPINSE', loginResponse);
    if (
      !loginResponse?.failed &&
      loginResponse?.succeeded &&
      loginResponse.data
    ) {
      const {data} = loginResponse;
      if (data?.requireOtp) {
        hideLoading();
        navigation.navigate('OTPLogin', {
          transId: data.transId!,
          pin: code,
        });
      } else if (loginResponse.data.accessToken) {
        const accessTokenOrigin = await EncryptHelper.decryptString(
          loginResponse.data.accessToken!,
          authenticationReducer.rsaPrivateKey!,
        );
        const loginToken = await EncryptHelper.encryptString(
          accessTokenOrigin,
          authenticationReducer.rsaPublicKey!,
        );

        hideLoading();
        setTimeout(() => {
          dispatch(
            AuthenticationActions.setAuthenticationData.request({
              ...data,
              loginToken,
              pin: code,
            }),
          );
          onSuccess && onSuccess();
        }, 200);
      }
    } else {
      onFailure &&
        onFailure(
          loginResponse?.data
            ? loginResponse.data.message
            : loginResponse.error?.message,
        );
      hideLoading();
    }
  };
  return {
    onLogin,
  };
};
