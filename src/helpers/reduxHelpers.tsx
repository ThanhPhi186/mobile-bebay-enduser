import {
  ActionReducerMapBuilder,
  createAction,
  createReducer,
} from '@reduxjs/toolkit';
// import {IApiResponse} from 'services/BaseApiService';
import {PayloadAction, AnyAction} from '@reduxjs/toolkit';

export function generateActions<P = void, S = void, F = any>(
  prefix: string,
  action: string,
) {
  const actionName = `${prefix}/${action}`;
  const requestName = `${actionName}_REQUEST`;
  const successName = `${actionName}_SUCCESS`;
  const failedName = `${actionName}_FAILED`;
  const request = createAction<P>(requestName);
  const success = createAction<S>(successName);
  const failed = createAction<any>(failedName);
  return {
    request,
    success,
    failed,
    actionName,
    failedName,
    successName,
    requestName,
  };
}
export function generateLocalAction<P = void>(prefix: string, action: string) {
  const actionName = `${prefix}/${action}`;
  const request = createAction<P>(actionName + '_LOCAL');
  return {
    request,
    actionName,
  };
}
export interface IBaseReducerState {
  action?: string;
}

export const handleReducerBuilder = (
  state: IBaseReducerState,
  action: PayloadAction<any> | AnyAction,
) => {
  state.action = action.type;
};
export function createHandleReducer<S extends IBaseReducerState>(
  initialState: S,
  builderCallback: (builder: ActionReducerMapBuilder<any>) => void,
) {
  return createReducer(initialState, build => {
    builderCallback(build);
    build.addDefaultCase(handleReducerBuilder);
  });
}
