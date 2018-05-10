import { Actions, ClearAsyncErrorAction } from '../../actions';
import { computeGroupState, FormGroupState, KeyValue } from '../../state';
import { childReducer } from './util';

export function clearAsyncErrorReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== ClearAsyncErrorAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.pendingValidations.indexOf(action.name) < 0) {
    return state;
  }

  const name = `$${action.name}`;

  let errors = state.errors;

  if (errors.hasOwnProperty(name)) {
    errors = { ...state.errors };
    delete (errors as any)[name];
  }

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
