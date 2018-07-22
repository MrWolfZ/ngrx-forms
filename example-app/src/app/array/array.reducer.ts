import { Action, combineReducers } from '@ngrx/store';
import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
} from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  options: boolean[];
}

export interface State extends RootState {
  array: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'array';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  options: [
    false,
    false,
    false,
    false,
  ],
});

const reducers = combineReducers<State['array']>({
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
});

export function reducer(s: State['array'], a: Action) {
  return reducers(s, a);
}
