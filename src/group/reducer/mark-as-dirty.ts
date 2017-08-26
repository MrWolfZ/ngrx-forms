import { FormGroupState, KeyValue } from '../../state';
import { Actions, MarkAsDirtyAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function markAsDirtyReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== MarkAsDirtyAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isDirty) {
    return state;
  }

  return computeGroupState(
    state.id,
    dispatchActionPerChild(state.controls, controlId => new MarkAsDirtyAction(controlId)),
    state.value,
    state.errors,
  );
}
