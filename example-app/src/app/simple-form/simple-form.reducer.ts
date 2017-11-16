import { Action, combineReducers } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

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
  simpleForm: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'simpleForm';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  favoriteColor: '',
  employed: false,
  notes: '',
});

export function reducer(_s: any, _a: any) {
  return combineReducers({
    formState(s = INITIAL_STATE, a: Action) {
      return formGroupReducer(s, a);
    },
  })(_s, _a);
};
