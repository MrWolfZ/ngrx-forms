import { Actions, SetAsyncErrorAction } from '../../actions';
import { computeGroupState, FormGroupState, KeyValue } from '../../state';
import { deepEquals } from '../../util';
import { childReducer } from './util';

export function setAsyncErrorReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== SetAsyncErrorAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isDisabled) {
    return state;
  }

  if (state.pendingValidations.indexOf(action.name) < 0) {
    return state;
  }

  const name = `$${action.name}`;
  let value = action.value;

  if (deepEquals(state.errors[name], action.value)) {
    value = state.errors[name];
  }

  const errors = { ...state.errors, [name]: value };
  const pendingValidations = state.pendingValidations.filter(v => v !== action.name);

  return computeGroupState(
    state.id,
    state.controls,
    state.value,
    errors,
    pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: state.isDirty,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: state.isTouched,
      wasOrShouldBeSubmitted: state.isSubmitted,
    },
  );
}
