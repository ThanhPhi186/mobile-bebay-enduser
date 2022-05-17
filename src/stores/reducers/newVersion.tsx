import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import i18next from 'i18next';
import {INewAppVersion} from 'models/services/IHome';
import {LanguageActions, NewVersionActions} from 'stores/actions';
import {ELanguage} from 'utils/i18n';
interface INewVersionState {
  newVersion?: INewAppVersion;
}

const initialState: INewVersionState = {};

const NewVersionReducer = createReducer(initialState, builder => {
  builder.addCase(
    NewVersionActions.setNewVersion.request,
    (state: INewVersionState, action: PayloadAction<INewAppVersion>) => {
      state.newVersion = action.payload;
    },
  );
});

export default NewVersionReducer;
