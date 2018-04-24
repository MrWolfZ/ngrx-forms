import { Action, ActionReducerMap } from '@ngrx/store';
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

export const reducers: ActionReducerMap<State['array']> = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
};
