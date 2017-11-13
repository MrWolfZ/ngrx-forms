import { FormGroupState, KeyValue } from '../../state';
import { Actions, MarkAsUntouchedAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function markAsUntouchedReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== MarkAsUntouchedAction.TYPE) {
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
    dispatchActionPerChild(state.controls, controlId => new MarkAsUntouchedAction(controlId)),
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
