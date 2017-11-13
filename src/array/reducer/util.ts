import { Actions } from '../../actions';
import { formControlReducerInternal } from '../../control/reducer';
import { formGroupReducerInternal } from '../../group/reducer';
import { AbstractControlState, FormArrayState, isArrayState, isGroupState, KeyValue, ValidationErrors } from '../../state';
import { isEmpty } from '../../util';
import { formArrayReducerInternal } from '../reducer';

export function getFormArrayValue<TValue>(
  controls: Array<AbstractControlState<TValue>>,
  originalValue: TValue[],
): TValue[] {
  let hasChanged = Object.keys(originalValue).length !== Object.keys(controls).length;
  const newValue = controls.map((state, i) => {
    hasChanged = hasChanged || originalValue[i] !== state.value;
    return state.value;
  });

  return hasChanged ? newValue : originalValue;
}

export function getFormArrayErrors<TValue>(
  controls: Array<AbstractControlState<TValue>>,
  originalErrors: ValidationErrors,
): ValidationErrors {
  let hasChanged = false;
  const groupErrors =
    Object.keys(originalErrors)
      .filter(key => !key.startsWith('_'))
      .reduce((res, key) => Object.assign(res, { [key]: originalErrors[key] }), {});

  const newErrors = controls.reduce((res, state, i) => {
    const controlErrors = state.errors;
    if (!isEmpty(controlErrors)) {
      hasChanged = hasChanged || originalErrors['_' + i] !== controlErrors;
      res['_' + i] = controlErrors;
    } else {
      hasChanged = hasChanged || originalErrors.hasOwnProperty('_' + i);
    }

    return res;
  }, groupErrors as ValidationErrors);

  hasChanged = hasChanged || Object.keys(originalErrors).length !== Object.keys(newErrors).length;

  return hasChanged ? newErrors : originalErrors;
}

export function computeArrayState<TValue>(
  id: string,
  controls: Array<AbstractControlState<TValue>>,
  value: TValue[],
  errors: ValidationErrors,
  pendingValidations: string[],
  userDefinedProperties: KeyValue,
): FormArrayState<TValue> {
  value = getFormArrayValue<TValue>(controls, value);
  errors = getFormArrayErrors(controls, errors);
  const isValid = isEmpty(errors);
  const isDirty = controls.some(state => state.isDirty);
  const isEnabled = controls.some(state => state.isEnabled);
  const isTouched = controls.some(state => state.isTouched);
  const isSubmitted = controls.some(state => state.isSubmitted);
  const isValidationPending = pendingValidations.length > 0 || controls.some(state => state.isValidationPending);
  return {
    id,
    value,
    errors,
    pendingValidations,
    isValidationPending,
    isValid,
    isInvalid: !isValid,
    isDirty,
    isPristine: !isDirty,
    isEnabled,
    isDisabled: !isEnabled,
    isTouched,
    isUntouched: !isTouched,
    isSubmitted,
    isUnsubmitted: !isSubmitted,
    controls,
    userDefinedProperties,
  };
}

export function callChildReducer(
  state: AbstractControlState<any>,
  action: Actions<any>,
): AbstractControlState<any> {
  if (isArrayState(state)) {
    return formArrayReducerInternal(state, action as any);
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state, action);
  }

  return formControlReducerInternal(state as any, action);
}

export function dispatchActionPerChild<TValue>(
  controls: Array<AbstractControlState<TValue>>,
  actionCreator: (controlId: string) => Actions<TValue>,
) {
  let hasChanged = false;
  const newControls = controls
    .map(state => {
      const newState = callChildReducer(state, actionCreator(state.id));
      hasChanged = hasChanged || state !== newState;
      return newState;
    });
  return hasChanged ? newControls : controls;
}

function callChildReducers<TValue>(
  controls: Array<AbstractControlState<TValue>>,
  action: Actions<TValue[]>,
): Array<AbstractControlState<TValue>> {
  let hasChanged = false;
  const newControls = controls
    .map(state => {
      const newState = callChildReducer(state, action);
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

  return computeArrayState(state.id, controls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties);
}
