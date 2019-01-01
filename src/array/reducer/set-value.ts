import { Actions, SetValueAction } from '../../actions';
import { formStateReducer } from '../../reducer';
import { computeArrayState, createChildState, FormArrayState } from '../../state';
import { childReducer } from './util';

export function setValueReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== SetValueAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.value === action.value) {
    return state;
  }

  if (action.value instanceof Date) {
    throw new Error('Date values are not supported. Please used serialized strings instead.');
  }

  const value = action.value;

  const controls = value
    .map((v, i) => {
      if (!state.controls[i]) {
        return createChildState(`${state.id}.${i}`, v);
      }

      return formStateReducer<TValue>(state.controls[i], new SetValueAction(state.controls[i].id, v));
    });

  return computeArrayState(
    state.id,
    controls,
    value,
    state.errors,
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
