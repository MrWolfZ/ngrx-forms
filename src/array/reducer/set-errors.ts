import { Actions, SetErrorsAction } from '../../actions';
import { computeArrayState, FormArrayState, ValidationErrors } from '../../state';
import { deepEquals } from '../../util';
import { childReducer } from './util';

export function setErrorsReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== SetErrorsAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isDisabled) {
    return state;
  }

  if (state.errors === action.errors) {
    return state;
  }

  if (deepEquals(state.errors, action.errors)) {
    return state;
  }

  if (!action.errors || typeof (action.errors as any) !== 'object' || Array.isArray(action.errors)) {
    throw new Error(`Control errors must be an object; got ${action.errors}`);
  }

  if (Object.keys(action.errors).some(key => key.startsWith('_'))) {
    throw new Error(`Control errors must not use underscore as a prefix; got ${JSON.stringify(action.errors)}`);
  }

  if (Object.keys(action.errors).some(key => key.startsWith('$'))) {
    throw new Error(`Control errors must not use $ as a prefix; got ${JSON.stringify(action.errors)}`);
  }

  const childAndAsyncErrors =
    Object.keys(state.errors)
      .filter(key => key.startsWith('_') || key.startsWith('$'))
      .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {} as ValidationErrors);

  const newErrors = Object.assign(childAndAsyncErrors, action.errors);

  return computeArrayState(
    state.id,
    state.controls,
    state.value,
    newErrors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: state.isDirty,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: state.isTouched,
      wasOrShouldBeSubmitted: state.isSubmitted,
    },
  );
}
