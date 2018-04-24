import { Action, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  selection: string;
}

export interface State extends RootState {
  valueConversion: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'valueConversion';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  selection: '[2, 4]',
});

export const reducers: ActionReducerMap<State['valueConversion']> = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
};
