import { FormGroupState, KeyValue } from '../../state';
import { Actions, DisableAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function disableReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== DisableAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isDisabled) {
    return state;
  }

  return computeGroupState(
    state.id,
    dispatchActionPerChild(state.controls, controlId => new DisableAction(controlId)),
    state.value,
    {},
    [],
    state.userDefinedProperties,
  );
}
