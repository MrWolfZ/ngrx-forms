import { Actions } from './actions';
import { formArrayReducerInternal } from './array/reducer';
import { formControlReducerInternal } from './control/reducer';
import { formGroupReducerInternal } from './group/reducer';
import { AbstractControlState, FormControlState, FormState, isArrayState, isGroupState } from './state';

export function inferredStateReducer<TValue>(
  state: AbstractControlState<TValue> | FormState<TValue>,
  action: Actions<any>,
): FormState<TValue> {
  if (isArrayState(state)) {
    return formArrayReducerInternal<TValue>(state, action as Actions<any[]>) as any;
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state, action) as any;
  }

  return formControlReducerInternal(state as FormControlState<any>, action) as any;
}
