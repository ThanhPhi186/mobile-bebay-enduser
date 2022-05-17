import {useBaseHook} from 'helpers/hookHelper';
import {UserActions} from 'stores/actions';

export const useUserServices = () => {
  const {dispatch} = useBaseHook();
  const onGetBalance = async () => {
    dispatch(UserActions.getBalance.request());
  };
  return {onGetBalance};
};
