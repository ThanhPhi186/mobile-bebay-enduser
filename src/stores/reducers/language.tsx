import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import i18next from 'i18next';
import {LanguageActions} from 'stores/actions';
import {ELanguage} from 'utils/i18n';
interface ILanguageState {
  language: ELanguage;
}

const initialState: ILanguageState = {
  language: ELanguage.EN,
};

const changeLanguage = (
  state: ILanguageState,
  action: PayloadAction<ELanguage>,
) => {
  state.language = action.payload;
  i18next.changeLanguage(action.payload);
};
const LanguageReducer = createReducer(initialState, builder => {
  builder.addCase(LanguageActions.changeLanguage.request, changeLanguage);
});

export default LanguageReducer;
