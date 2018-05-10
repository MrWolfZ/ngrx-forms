import { Actions } from '../../actions';
import { formStateReducer } from '../../reducer';
import { computeGroupState, FormGroupControls, FormGroupState, FormState, KeyValue } from '../../state';

export function dispatchActionPerChild<TValue extends KeyValue>(
  controls: FormGroupControls<TValue>,
  actionCreator: (controlId: string) => Actions<TValue>,
) {
  let hasChanged = false;
  const newControls = Object.keys(controls)
    .reduce((c, key) => {
      Object.assign(c, { [key]: formStateReducer(controls[key], actionCreator(controls[key].id)) });
      hasChanged = hasChanged || c[key] !== controls[key];
      return c;
    }, {} as FormGroupControls<TValue>);
  return hasChanged ? newControls : controls;
}

function callChildReducers<TValue extends { [key: string]: any }>(
  controls: FormGroupControls<TValue>,
  action: Actions<TValue>,
): FormGroupControls<TValue> {
  let hasChanged = false;
  const newControls = Object.keys(controls)
    .map(key => [key, formStateReducer(controls[key], action)] as [string, FormState<any>])
    .reduce((res, [key, state]) => {
      hasChanged = hasChanged || state !== controls[key];
      return Object.assign(res, { [key]: state });
    }, {} as FormGroupControls<TValue>);
  return hasChanged ? newControls : controls;
}

export function childReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>) {
  const controls = callChildReducers(state.controls, action);

  if (state.controls === controls) {
    return state;
  }

  return computeGroupState(
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
