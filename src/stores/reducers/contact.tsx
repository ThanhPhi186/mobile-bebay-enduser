import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {createHandleReducer, IBaseReducerState} from 'helpers/reduxHelpers';
import i18next from 'i18next';
import {IInviteInfoResponse} from 'models/services/IInvite';
import moment, {Moment} from 'moment';
import {ContactActions, LanguageActions} from 'stores/actions';
import {ELanguage} from 'utils/i18n';
interface IContactState extends IBaseReducerState {
  invite: {
    listInviteNumber?: string;
    listNotAccountEWallet?: string;
    listPhoneNumberWithWallet?: string;
    lastUpdated?: Moment;
  };
  notInvite: {
    listInviteNumber?: string;
    listNotAccountEWallet?: string;
    listPhoneNumberWithWallet?: string;
    lastUpdated?: Moment;
  };
}

const initialState: IContactState = {
  invite: {},
  notInvite: {},
};

const inviteInfoSuccess = (
  state: IContactState,
  action: PayloadAction<IInviteInfoResponse>,
) => {
  state.invite = {
    listInviteNumber: action.payload.listInviteNumber,
    listNotAccountEWallet: action.payload.listNotAccountEWallet,
    listPhoneNumberWithWallet: action.payload.listPhoneNumberWithWallet,
    lastUpdated: moment(),
  };
};
const notInviteInfoSuccess = (
  state: IContactState,
  action: PayloadAction<IInviteInfoResponse>,
) => {
  state.notInvite = {
    listInviteNumber: action.payload.listInviteNumber,
    listNotAccountEWallet: action.payload.listNotAccountEWallet,
    listPhoneNumberWithWallet: action.payload.listPhoneNumberWithWallet,
    lastUpdated: moment(),
  };
};
const invite = (state: IContactState, action: PayloadAction<string>) => {
  state.invite = {
    ...state.invite,
    listInviteNumber: state.invite.listInviteNumber
      ? state.invite.listInviteNumber + `,${action.payload}`
      : `${action.payload}`,
  };
  if (state.notInvite) {
    state.notInvite = {
      ...state.notInvite,
      listInviteNumber: state.notInvite.listInviteNumber
        ? state.notInvite.listInviteNumber + `,${action.payload}`
        : `${action.payload}`,
    };
  } else {
    state.notInvite = {
      listInviteNumber: `${action.payload}`,
    };
  }
};

const ContactReducer = createHandleReducer(initialState, builder => {
  builder
    .addCase(ContactActions.getInfoInvite.success, inviteInfoSuccess)
    .addCase(ContactActions.getInfoNotInvite.success, notInviteInfoSuccess)
    .addCase(ContactActions.invite.request, invite);
});

export default ContactReducer;
