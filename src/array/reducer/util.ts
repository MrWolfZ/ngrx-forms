import { Actions } from '../../actions';
import { formStateReducer } from '../../reducer';
import { computeArrayState, FormArrayState, FormGroupControls, FormGroupState, FormState, isArrayState, isGroupState } from '../../state';

export function dispatchActionPerChild<TValue>(
  controls: ReadonlyArray<FormState<TValue>>,
  actionCreator: (controlId: string) => Actions<TValue>,
): ReadonlyArray<FormState<TValue>> {
  let hasChanged = false;
  const newControls = controls
    .map(state => {
      const newState = formStateReducer<TValue>(state, actionCreator(state.id));
      hasChanged = hasChanged || state !== newState;
      return newState;
    });

  return hasChanged ? newControls : controls;
}

function callChildReducers<TValue>(
  controls: ReadonlyArray<FormState<TValue>>,
  action: Actions<TValue[]>,
): ReadonlyArray<FormState<TValue>> {
  let hasChanged = false;
  const newControls = controls
    .map(state => {
      const newState = formStateReducer<TValue>(state, action);
      hasChanged = hasChanged || state !== newState;
      return newState;
    });

  return hasChanged ? newControls : controls;
}

export function childReducer<TValue>(state: FormArrayState<TValue>, action: Actions<TValue[]>) {
  const controls = callChildReducers(state.controls, action);

  if (state.controls === controls) {
    return state;
  }

  return computeArrayState(
    state.id,
    controls,
    state.value,
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

export function updateIdRecursiveForGroup<TValue>(state: FormGroupState<TValue>, newId: string): FormGroupState<TValue> {
  const controls: FormGroupControls<TValue> =
    Object.keys(state.controls)
      .reduce((agg, key) => Object.assign(agg, {
        [key]: updateIdRecursive<TValue[keyof TValue]>(state.controls[key as keyof TValue], `${newId}.${key}`),
      }), {} as FormGroupControls<TValue>);

  return {
    ...state,
    id: newId,
    controls,
  };
}

export function updateIdRecursiveForArray<TValue>(state: FormArrayState<TValue>, newId: string): FormArrayState<TValue> {
  const controls = state.controls.map((c, i) => updateIdRecursive(c, `${newId}.${i}`));

  return {
    ...state,
    id: newId,
    controls,
  };
}

export function updateIdRecursive<TValue>(state: FormState<TValue>, newId: string): FormState<TValue> {
  if (state.id === newId) {
    return state;
  }

  if (isGroupState<TValue>(state)) {
    return updateIdRecursiveForGroup<TValue>(state, newId) as FormState<TValue>;
  }

  if (isArrayState<TValue>(state)) {
    return updateIdRecursiveForArray<TValue>(state, newId) as any;
  }

  return {
    ...(state as any),
    id: newId,
  };
}
