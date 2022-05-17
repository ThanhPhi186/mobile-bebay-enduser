import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {AlertType} from 'models/EAlertType';
import {AppActions, AuthenticationActions, OTPActions} from 'stores/actions';
import {
  IBaseReducerState,
  createHandleReducer,
} from '../../helpers/reduxHelpers';
import {IAppConfig} from '../../models/IAppConfig';
interface IOTPState extends IBaseReducerState {
  featureCode?: string;
  transId?: string;
  otpMessage?: string;
}

const initialState: IOTPState = {};

const OTPReducer = createHandleReducer(initialState, builder => {
  builder
    .addCase(
      OTPActions.setOTPConfig.request,
      (
        state: IOTPState,
        action: PayloadAction<{
          transId: string;
          featureCode: string;
          otpMessage?: string;
        }>,
      ) => {
        state.featureCode = action.payload.featureCode;
        state.transId = action.payload.transId;
        state.otpMessage = action.payload.otpMessage;
      },
    )
    .addCase(AuthenticationActions.logout.request, (state: IOTPState) => {
      state.featureCode = undefined;
      state.transId = undefined;
      state.otpMessage = undefined;
    });
});

export default OTPReducer;
