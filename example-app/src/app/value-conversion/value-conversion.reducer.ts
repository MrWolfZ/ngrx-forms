import { Action, combineReducers } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  date: string;
}

export interface State extends RootState {
  valueConversion: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'valueConversion';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  date: '',
});

const reducers = combineReducers<State['valueConversion']>({
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
});

export function reducer(s: State['valueConversion'], a: Action) {
  return reducers(s, a);
}
