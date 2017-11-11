import { Action } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

import { State as RootState } from '../reducer';

export interface SimpleFormValue {
  firstName: string;
}

export interface State extends RootState {
  simpleForm: FormGroupState<SimpleFormValue>;
}

export const FORM_ID = 'simpleForm';

export const INITIAL_STATE = createFormGroupState<SimpleFormValue>(FORM_ID, {
  firstName: '',
});

export const reducers = {
  simpleForm: (s = INITIAL_STATE, a: Action) => formGroupReducer(s, a),
};
