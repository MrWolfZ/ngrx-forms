import {NgrxFormActionTypes, SetAsyncErrorAction} from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { deepEquals } from '../../util';
import { childReducer } from './util';

export function setAsyncErrorReducer<TValue>(
  state: FormArrayState<TValue>,
  action: NgrxFormActionTypes,
): FormArrayState<TValue> {
  if (action.type !== SetAsyncErrorAction.type) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isDisabled) {
    return state;
  }

  const name = `$${action.name}`;
  let value = action.value;

  if (deepEquals(state.errors[name], action.value)) {
    value = state.errors[name];
  }

  const errors = { ...state.errors, [name]: value };
  const pendingValidations = state.pendingValidations.filter(v => v !== action.name);

  return computeArrayState(
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
