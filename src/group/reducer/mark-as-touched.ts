import { Actions, MarkAsTouchedAction } from '../../actions';
import { computeGroupState, FormGroupState, KeyValue } from '../../state';
import { childReducer, dispatchActionPerChild } from './util';

export function markAsTouchedReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== MarkAsTouchedAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  const controls = dispatchActionPerChild(state.controls, controlId => new MarkAsTouchedAction(controlId));

  if (controls === state.controls) {
    return state;
  }

  return computeGroupState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: state.isDirty,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: true,
      wasOrShouldBeSubmitted: state.isSubmitted,
    },
  );
}
