import { FormGroupState, KeyValue } from '../../state';
import { Actions, ResetAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function resetReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== ResetAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isPristine && state.isUntouched && state.isUnsubmitted) {
    return state;
  }

  return computeGroupState(
    state.id,
    dispatchActionPerChild(state.controls, controlId => new ResetAction(controlId)),
    state.value,
    state.errors,
    state.userDefinedProperties,
  );
}
