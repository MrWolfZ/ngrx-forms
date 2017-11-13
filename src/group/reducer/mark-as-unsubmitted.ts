import { FormGroupState, KeyValue } from '../../state';
import { Actions, MarkAsUnsubmittedAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function markAsUnsubmittedReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== MarkAsUnsubmittedAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isUnsubmitted) {
    return state;
  }

  return computeGroupState(
    state.id,
    dispatchActionPerChild(state.controls, controlId => new MarkAsUnsubmittedAction(controlId)),
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
