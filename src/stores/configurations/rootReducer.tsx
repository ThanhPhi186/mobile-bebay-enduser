import {combineReducers} from 'redux';

import {
  AppReducer,
  LanguageReducer,
  AuthenticationReducer,
  UserReducer,
  NewAppVersionReducer,
  OTPReducer,
  ContactReducer,
} from '../reducers';
const rootReducer = combineReducers({
  AppReducer,
  LanguageReducer,
  AuthenticationReducer,
  UserReducer,
  OTPReducer,
  NewAppVersionReducer,
  ContactReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
