import { Action, combineReducers } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  countryCode: string;
}

export interface State extends RootState {
  valueTransformation: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'valueTransformation';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  countryCode: '',
});

const reducers = combineReducers<State['valueTransformation']>({
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
});

export function reducer(s: State['valueTransformation'], a: Action) {
  return reducers(s, a);
}
