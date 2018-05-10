import { Actions, StartAsyncValidationAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer } from './util';

export function startAsyncValidationReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== StartAsyncValidationAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.pendingValidations.indexOf(action.name) >= 0) {
    return state;
  }

  const pendingValidations = [...state.pendingValidations, action.name];

  return computeArrayState(
    state.id,
    state.controls,
    state.value,
    state.errors,
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
