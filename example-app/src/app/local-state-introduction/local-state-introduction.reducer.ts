import { Action } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

export interface FormValue {
  countryCode: string;
}

export const FORM_ID = 'localStateForm';

export const INITIAL_FORM_STATE = createFormGroupState<FormValue>(FORM_ID, {
  countryCode: '',
});

export function reducer(fs: FormGroupState<FormValue> = INITIAL_FORM_STATE, a: Action) {
  return formGroupReducer(fs, a);
}
