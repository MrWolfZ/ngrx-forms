import {NgrxFormActionTypes, SetValueAction} from '../../actions';
import { formStateReducer } from '../../reducer';
import { computeArrayState, createChildState, FormArrayState } from '../../state';
import { childReducer } from './util';

export function setValueReducer<TValue>(
  state: FormArrayState<TValue>,
  action: NgrxFormActionTypes,
): FormArrayState<TValue> {
  if (action.type !== SetValueAction.type) {
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
    .map((v: any, i: number) => {
      if (!state.controls[i]) {
        return createChildState(`${state.id}.${i}`, v);
      }

      return formStateReducer<TValue>(state.controls[i], SetValueAction(state.controls[i].id, v));
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
