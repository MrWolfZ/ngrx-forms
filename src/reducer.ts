import { Action } from '@ngrx/store';

import { formArrayReducer } from './array/reducer';
import { formControlReducer } from './control/reducer';
import { formGroupReducer } from './group/reducer';
import { AbstractControlState, FormControlState, FormState, isArrayState, isFormState, isGroupState } from './state';

export function formStateReducer<TValue>(
  state: FormState<TValue> | AbstractControlState<TValue> | undefined,
  action: Action,
): FormState<TValue> {
  if (!state) {
    throw new Error('The form state must be defined!');
  }

  if (!isFormState(state)) {
    throw new Error(`state must be a form state, got ${state}`);
  }

  if (isGroupState(state)) {
    return formGroupReducer(state, action) as any;
  }

  if (isArrayState(state)) {
    return formArrayReducer(state, action) as any;
  }

  return formControlReducer(state as FormControlState<any>, action) as any;
}
