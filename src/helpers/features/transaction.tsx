import {EncryptHelper} from 'helpers';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import TransactionService from 'services/TransactionService';
import {ITransactionDetailRequest, ITransactionListSRequest} from 'models/services/ITransaction';

export const useTransaction = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();

  const onGetTransactionService = async () => {
    const response = await TransactionService.getTransactionService();
    return response;
  };

  const onGetListTransaction = async (
    transId: string,
    fromDate: string,
    toDate: string,
    transType: string,
    page: number,
  ) => {
    showLoading();
    const text = `${transId}${transType}`;

    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITransactionListSRequest = {
      signature,
      transId,
      fromDate,
      toDate,
      transType,
      page,
    };
    const response = await TransactionService.getListTransaction(params);
    hideLoading();
    if (response?.succeeded && response.data) {
      return response;
    }
  };
  const onGetTransactionDetail = async (
    transactionId: string
  ) => {
    showLoading();
    const text = `${transactionId}`;

    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ITransactionDetailRequest = {
      transactionId
    };
    const response = await TransactionService.getTransactionDetail(params);
    hideLoading();
    if (response?.succeeded && response.data) {
      return response;
    }
  };

  return {onGetTransactionService, onGetListTransaction, onGetTransactionDetail};
};
