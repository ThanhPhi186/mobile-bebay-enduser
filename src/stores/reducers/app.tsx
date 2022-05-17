import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {AlertType} from 'models/EAlertType';
import {AppActions} from 'stores/actions';
import {
  IBaseReducerState,
  createHandleReducer,
} from '../../helpers/reduxHelpers';
import {IAppConfig} from '../../models/IAppConfig';
interface IAppState extends IBaseReducerState {
  appConfig: Partial<IAppConfig>;
  is_server_down?: boolean;
  deviceId?: string;
}

const initialState: IAppState = {
  appConfig: {},
};

const AppReducer = createHandleReducer(initialState, builder => {
  builder
    .addCase(
      AppActions.setConfig.request,
      (state: IAppState, action: PayloadAction<IAppConfig>) => {
        state.appConfig = {
          ...state.appConfig,
          ...action.payload,
        };
      },
    )
    .addCase(
      AppActions.setServerDown.request,
      (state: IAppState, action: PayloadAction<boolean>) => {
        state.is_server_down = action.payload;
      },
    )
    .addCase(
      AppActions.setDeviceId.request,
      (state: IAppState, action: PayloadAction<string>) => {
        state.deviceId = action.payload;
      },
    );
});

export default AppReducer;
