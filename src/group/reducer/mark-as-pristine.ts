import { FormGroupState, KeyValue } from '../../state';
import { Actions, MarkAsPristineAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function markAsPristineReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== MarkAsPristineAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isPristine) {
    return state;
  }

  return computeGroupState(
    state.id,
    dispatchActionPerChild(state.controls, controlId => new MarkAsPristineAction(controlId)),
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
