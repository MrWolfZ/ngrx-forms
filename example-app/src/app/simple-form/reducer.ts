import { Action } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

import { State as RootState } from '../reducer';

export interface SimpleFormValue {
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
    formState: FormGroupState<SimpleFormValue>;
  };
}

export const FORM_ID = 'simpleForm';

export const INITIAL_STATE = createFormGroupState<SimpleFormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  favoriteColor: '',
  employed: false,
  notes: '',
});

export const reducers = {
  formState: (s = INITIAL_STATE, a: Action) => formGroupReducer(s, a),
};
