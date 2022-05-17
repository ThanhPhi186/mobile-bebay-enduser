import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import {IHomeResponse} from 'models/services/IHome';
import HomeServices from 'services/HomeServices';

export const useHomeServices = () => {
  const {showLoading, hideLoading} = useBaseHook();
  const onGetInfo = async () => {
    showLoading();
    const response = await HomeServices.getInfo({});
    hideLoading();
    if (response?.succeeded) {
      return response;
    }
  };
  return {onGetInfo};
};
