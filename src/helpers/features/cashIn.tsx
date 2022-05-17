import {CurrencyHelper, EncryptHelper} from 'helpers';
import {
  ITopUpConfirmRequest,
  ITopUpOTPRequest,
  ITopUpRequest,
} from 'models/services/ITopUp';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import TopUpServices from 'services/TopUpServices';
import {ICashInRequest} from 'models/services/ICashin';
import CashInService from 'services/CashInService';

export const useCashIn = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {showLoading, hideLoading} = useBaseHook();

  const onListAgentLocation = async (
    lat: string,
    lon: string,
    distance: string,
  ) => {
    showLoading();
    const text = `${lat}${lon}`;
    const signature = await EncryptHelper.encryptSha256(
      text,
      authenticationReducer.signatureKey!,
    );
    const params: ICashInRequest = {
      signature,
      lat,
      lon,
      distance,
    };
    const response = await CashInService.getListAgentLocation(params);
    hideLoading();
    return response;
  };

  return {onListAgentLocation};
};
