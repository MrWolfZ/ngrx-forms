import {MarkAsUntouchedAction, NgrxFormActionTypes} from '../../actions';
import { computeGroupState, FormGroupState, KeyValue } from '../../state';
import { childReducer, dispatchActionPerChild } from './util';

export function markAsUntouchedReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: NgrxFormActionTypes,
): FormGroupState<TValue> {
  if (action.type !== MarkAsUntouchedAction.type) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isUntouched) {
    return state;
  }

  return computeGroupState(
    state.id,
    dispatchActionPerChild(state.controls, controlId => MarkAsUntouchedAction(controlId)),
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: state.isDirty,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: false,
      wasOrShouldBeSubmitted: state.isSubmitted,
    },
  );
}
