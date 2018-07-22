import { Action, combineReducers } from '@ngrx/store';
import { box, Boxed, createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  selection: Boxed<number[]>;
}

export interface State extends RootState {
  valueBoxing: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'valueBoxing';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  selection: box([2, 4]),
});

const reducers = combineReducers<State['valueBoxing']>({
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
});

export function reducer(s: State['valueBoxing'], a: Action) {
  return reducers(s, a);
}
