import {EncryptHelper} from 'helpers';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import {
  IGetAllRecentRequest,
  IGetListRecentRequest,
} from 'models/services/IRecent';
import {
  ICheckSubRequest,
  ITransactionFavoriteRequest,
} from 'models/services/ITransfer';
import CommonServices from 'services/CommonServices';

export const useCommon = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();
  const onCheckSub = async (phoneNumber: string) => {
    showLoading();
    const text = `${phoneNumber}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ICheckSubRequest = {
      signature,
      accountNumber: phoneNumber,
    };
    const transferResponse = await CommonServices.checkSub(params);
    hideLoading();
    if (transferResponse?.succeeded && !transferResponse.failed) {
      return {
        succeed: true,
        data: transferResponse.data,
      };
    } else {
      return {
        succeed: false,
        data: transferResponse?.data,
      };
    }
  };
  const onGetListRecent = async (featureCode: string) => {
    const text = `${featureCode}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IGetListRecentRequest = {
      signature,
      featureCode: featureCode,
    };
    const transferResponse = await CommonServices.getListRecent(params);
    if (transferResponse?.succeeded && transferResponse.data) {
      return transferResponse.data;
    }
  };
  const onTransactionFavorite = async (
    transId: string,
    featureCode: string,
    favorite: number,
  ) => {
    const text = `${transId}${featureCode}${favorite}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITransactionFavoriteRequest = {
      signature,
      transId: transId,
      featureCode: featureCode,
      favorite: favorite,
    };
    const transactionFavoriteResponse =
      await CommonServices.transactionFavorite(params);
    hideLoading();
    if (
      transactionFavoriteResponse?.succeeded &&
      !transactionFavoriteResponse.failed
    ) {
      return {
        succeed: true,
        data: transactionFavoriteResponse.data,
      };
    } else {
      return {
        succeed: false,
        data: transactionFavoriteResponse?.data,
      };
    }
  };

  const onGetAllRecent = async (featureCode: string, type: string) => {
    const text = `${featureCode}${type}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: IGetAllRecentRequest = {
      signature,
      type,
      featureCode: featureCode,
    };
    const transferResponse = await CommonServices.getAllRecent(params);
    if (transferResponse?.succeeded && transferResponse.data) {
      return transferResponse.data;
    }
  };
  return {onCheckSub, onGetListRecent, onTransactionFavorite, onGetAllRecent};
};
