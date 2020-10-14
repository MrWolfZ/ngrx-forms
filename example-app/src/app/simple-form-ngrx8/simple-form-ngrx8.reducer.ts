import { Action, createAction, createReducer, on, props } from '@ngrx/store';
import { createFormGroupState, FormGroupState, onNgrxForms } from 'ngrx-forms';
import { State as RootState } from '../app.reducer';

export interface FormValue {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  favoriteColor: string;
  employed: boolean;
  notes: string;
}

export interface State extends RootState {
  simpleFormNgrx8: {
    formState: FormGroupState<FormValue>;
    submittedValue: FormValue | undefined;
  };
}

export const setSubmittedValue = createAction(
  'simpleFormNgrx8/SET_SUBMITTED_VALUE',
  props<{ submittedValue: FormValue }>(),
);

export const FORM_ID = 'simpleFormNgrx8';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  favoriteColor: '',
  employed: false,
  notes: '',
});

export const combinedReducer = createReducer<State['simpleFormNgrx8']>(
  { formState: INITIAL_STATE, submittedValue: undefined },
  onNgrxForms(),
  on(setSubmittedValue, (state, { submittedValue }) => ({ ...state, submittedValue })),
);

export function reducer(s: State['simpleFormNgrx8'], a: Action) {
  return combinedReducer(s, a);
}
