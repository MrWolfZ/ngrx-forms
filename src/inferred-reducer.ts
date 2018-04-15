import { Actions } from './actions';
import { formArrayReducerInternal } from './array/reducer';
import { formControlReducerInternal } from './control/reducer';
import { formGroupReducerInternal } from './group/reducer';
import { FormControlState, InferredControlState, isArrayState, isGroupState } from './state';

export function inferredStateReducer<TValue>(
  state: InferredControlState<TValue>,
  action: Actions<any>,
): InferredControlState<TValue> {
  if (isArrayState(state)) {
    return formArrayReducerInternal<TValue>(state, action as Actions<any[]>) as any;
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state, action) as any;
  }

  return formControlReducerInternal(state as FormControlState<any>, action) as any;
}
