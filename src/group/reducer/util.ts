import { Actions } from '../../actions';
import { formArrayReducerInternal } from '../../array/reducer';
import { formControlReducerInternal } from '../../control/reducer';
import {
  AbstractControlState,
  FormGroupControls,
  FormGroupState,
  isArrayState,
  isGroupState,
  KeyValue,
  ValidationErrors,
} from '../../state';
import { isEmpty } from '../../util';
import { formGroupReducerInternal } from '../reducer';

export function getFormGroupValue<TValue extends { [key: string]: any }>(
  controls: FormGroupControls<TValue>,
  originalValue: TValue,
): TValue {
  let hasChanged = Object.keys(originalValue).length !== Object.keys(controls).length;
  const newValue = Object.keys(controls).reduce((res, key) => {
    hasChanged = hasChanged || originalValue[key] !== controls[key].value;
    res[key] = controls[key].value;
    return res;
  }, {} as TValue);

  return hasChanged ? newValue : originalValue;
}

export function getFormGroupErrors<TValue extends object>(
  controls: FormGroupControls<TValue>,
  originalErrors: ValidationErrors,
): ValidationErrors {
  let hasChanged = false;
  const groupErrors =
    Object.keys(originalErrors)
      .filter(key => !key.startsWith('_'))
      .reduce((res, key) => Object.assign(res, { [key]: originalErrors[key] }), {});

  const newErrors = Object.keys(controls).reduce((res, key: any) => {
    const controlErrors = controls[key].errors;
    if (!isEmpty(controlErrors)) {
      hasChanged = hasChanged || originalErrors['_' + key] !== controlErrors;
      res['_' + key] = controls[key].errors;
    } else {
      hasChanged = hasChanged || originalErrors.hasOwnProperty('_' + key);
    }

    return res;
  }, groupErrors as ValidationErrors);

  hasChanged = hasChanged || Object.keys(originalErrors).length !== Object.keys(newErrors).length;

  return hasChanged ? newErrors : originalErrors;
}

export function computeGroupState<TValue extends KeyValue>(
  id: string,
  controls: FormGroupControls<TValue>,
  value: TValue,
  errors: ValidationErrors,
  pendingValidations: string[],
  userDefinedProperties: KeyValue,
): FormGroupState<TValue> {
  value = getFormGroupValue<TValue>(controls, value);
  errors = getFormGroupErrors(controls, errors);
  const isValid = isEmpty(errors);
  const isDirty = Object.keys(controls).some(key => controls[key].isDirty);
  const isEnabled = Object.keys(controls).some(key => controls[key].isEnabled);
  const isTouched = Object.keys(controls).some(key => controls[key].isTouched);
  const isSubmitted = Object.keys(controls).some(key => controls[key].isSubmitted);
  const isValidationPending = pendingValidations.length > 0 || Object.keys(controls).some(key => controls[key].isValidationPending);
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
    return formArrayReducerInternal(state as any, action as any);
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state as any, action);
  }

  return formControlReducerInternal(state as any, action);
}

export function dispatchActionPerChild<TValue extends KeyValue>(
  controls: FormGroupControls<TValue>,
  actionCreator: (controlId: string) => Actions<TValue>,
) {
  let hasChanged = false;
  const newControls = Object.keys(controls)
    .reduce((c, key) => {
      c[key] = callChildReducer(controls[key], actionCreator(controls[key].id));
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
    .map(key => [key, callChildReducer(controls[key], action)] as [string, AbstractControlState<any>])
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

  return computeGroupState(state.id, controls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties);
}
