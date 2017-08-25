import { Action } from '@ngrx/store';
import { ValidationErrors } from '@angular/forms';

import {
  AbstractControlState,
  FormControlState,
  createFormControlState,
  SupportedNgrxFormControlValueTypes,
  FormGroupState,
  createFormGroupState,
} from './state';
import {
  Actions,
  SetValueAction,
  SetErrorsAction,
  MarkAsDirtyAction,
  MarkAsPristineAction,
  EnableAction,
  DisableAction,
  MarkAsTouchedAction,
  MarkAsUntouchedAction,
  FocusAction,
  UnfocusAction,
  SetLastKeyDownCodeAction,
  MarkAsSubmittedAction,
  MarkAsUnsubmittedAction,
} from './actions';

function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function formControlReducerInternal<TValue extends SupportedNgrxFormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.controlId !== state.id) {
    return state;
  }

  switch (action.type) {
    case SetValueAction.TYPE:
      if (state.value === action.payload.value) {
        return state;
      }

      const value = action.payload.value;
      const valueType = typeof value;
      if (value !== null && ['string', 'number', 'boolean', 'undefined'].indexOf(valueType) === -1) {
        const errorMsg = 'Form control states only support undefined, null, string, number, and boolean values';
        throw new Error(`${errorMsg}; got ${JSON.stringify(action.payload.value)} of type "${valueType}"`); // `;
      }

      return {
        ...state,
        value: action.payload.value,
        isDirty: true,
        isPristine: false,
      };

    case SetErrorsAction.TYPE:
      if (!action.payload.errors) {
        throw new Error(`Control errors must be an object; got ${action.payload.errors}`); // `;
      }

      if (state.errors === action.payload.errors) {
        return state;
      }

      if (isEmpty(state.errors) && isEmpty(action.payload.errors)) {
        return state;
      }

      if (state.isDisabled) {
        return state;
      }

      const isValid = isEmpty(action.payload.errors);
      return {
        ...state,
        isValid,
        isInvalid: !isValid,
        errors: action.payload.errors,
      };

    case MarkAsDirtyAction.TYPE:
      if (state.isDirty) {
        return state;
      }

      return {
        ...state,
        isDirty: true,
        isPristine: false,
      };

    case MarkAsPristineAction.TYPE:
      if (state.isPristine) {
        return state;
      }

      return {
        ...state,
        isDirty: false,
        isPristine: true,
      };

    case EnableAction.TYPE:
      if (state.isEnabled) {
        return state;
      }

      return {
        ...state,
        isEnabled: true,
        isDisabled: false,
      };

    case DisableAction.TYPE:
      if (state.isDisabled) {
        return state;
      }

      return {
        ...state,
        isEnabled: false,
        isDisabled: true,
        isValid: true,
        isInvalid: false,
        errors: {},
      };

    case MarkAsTouchedAction.TYPE:
      if (state.isTouched) {
        return state;
      }

      return {
        ...state,
        isTouched: true,
        isUntouched: false,
      };

    case MarkAsUntouchedAction.TYPE:
      if (state.isUntouched) {
        return state;
      }

      return {
        ...state,
        isTouched: false,
        isUntouched: true,
      };

    case FocusAction.TYPE:
      if (state.isFocused) {
        return state;
      }

      return {
        ...state,
        isFocused: true,
        isUnfocused: false,
      };

    case UnfocusAction.TYPE:
      if (state.isUnfocused) {
        return state;
      }

      return {
        ...state,
        isFocused: false,
        isUnfocused: true,
      };

    case SetLastKeyDownCodeAction.TYPE:
      if (state.lastKeyDownCode === action.payload.lastKeyDownCode) {
        return state;
      }

      return {
        ...state,
        lastKeyDownCode: action.payload.lastKeyDownCode,
      };

    case MarkAsSubmittedAction.TYPE:
      if (state.isSubmitted) {
        return state;
      }

      return {
        ...state,
        isSubmitted: true,
        isUnsubmitted: false,
      };

    case MarkAsUnsubmittedAction.TYPE:
      if (state.isUnsubmitted) {
        return state;
      }

      return {
        ...state,
        isSubmitted: false,
        isUnsubmitted: true,
      };

    default: {
      return state;
    }
  }
}

export function formControlReducer<TValue extends SupportedNgrxFormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Action,
) {
  return formControlReducerInternal(state, action as any);
}

type Controls<TValue> = {[controlId in keyof TValue]: AbstractControlState<TValue[controlId]> };

function getFormGroupValue<TValue extends { [key: string]: any }>(controls: Controls<TValue>, originalValue: TValue): TValue {
  let hasChanged = Object.keys(originalValue).length !== Object.keys(controls).length;
  const newValue = Object.keys(controls).reduce((res, key) => {
    hasChanged = hasChanged || originalValue[key] !== controls[key].value;
    res[key] = controls[key].value;
    return res;
  }, {} as TValue);

  return hasChanged ? newValue : originalValue;
}

function getFormGroupErrors<TValue extends object>(
  controls: Controls<TValue>,
  originalErrors: ValidationErrors,
): ValidationErrors {
  let hasChanged = false;
  const groupErrors =
    Object.keys(originalErrors)
      .filter(key => !key.startsWith('_'))
      .reduce((res, key) => Object.assign(res, { [key]: originalErrors[key] }), {});

  const newErrors = Object.keys(controls).reduce((res, key) => {
    const controlErrors = controls[key].errors;
    hasChanged = hasChanged || originalErrors['_' + key] !== controlErrors;
    if (!isEmpty(controlErrors)) {
      res['_' + key] = controls[key].errors;
    }
    return res;
  }, groupErrors as ValidationErrors);

  hasChanged = hasChanged || Object.keys(originalErrors).length !== Object.keys(newErrors).length;

  return hasChanged ? newErrors : originalErrors;
}

function createChildState(id: string, childValue: any): AbstractControlState<any> {
  if (childValue !== null && typeof childValue === 'object') {
    return createFormGroupState(id, childValue);
  }

  return createFormControlState(id, childValue);
}

function isGroupState(state: AbstractControlState<any>): boolean {
  return state.hasOwnProperty('controls');
}

function callChildReducer(
  state: AbstractControlState<any>,
  action: Actions<any>,
): AbstractControlState<any> {
  if (isGroupState(state)) {
    return formGroupReducerInternal(state as FormGroupState<any>, action);
  }

  return formControlReducerInternal(state as FormControlState<any>, action);
}

function callChildReducers<TValue extends { [key: string]: any }>(controls: Controls<TValue>, action: Actions<TValue>): Controls<TValue> {
  let hasChanged = false;
  const newControls = Object.keys(controls)
    .map(key => [key, callChildReducer(controls[key], action)] as [string, AbstractControlState<any>])
    .reduce((res, [key, state]) => {
      hasChanged = hasChanged || state !== controls[key];
      return Object.assign(res, { [key]: state });
    }, {} as Controls<TValue>);
  return hasChanged ? newControls : controls;
}

export interface KeyValue { [key: string]: any; }

function computeGroupState<TValue extends KeyValue>(id: string, controls: Controls<TValue>, value: TValue, errors: ValidationErrors) {
  value = getFormGroupValue<TValue>(controls, value);
  errors = getFormGroupErrors(controls, errors);
  const isValid = isEmpty(errors);
  const isDirty = Object.keys(controls).some(key => controls[key].isDirty);
  const isEnabled = Object.keys(controls).some(key => controls[key].isEnabled);
  const isTouched = Object.keys(controls).some(key => controls[key].isTouched);
  const isSubmitted = Object.keys(controls).some(key => controls[key].isSubmitted);
  return {
    id,
    value,
    errors,
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
  };
}

function childReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>) {
  const controls = callChildReducers(state.controls, action);

  if (state.controls === controls) {
    return state;
  }

  return computeGroupState(state.id, controls, state.value, state.errors);
}

function groupReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>): FormGroupState<TValue> {
  if (action.controlId !== state.id) {
    return state;
  }

  const dispatchActionPerChild = (actionCreator: (controlId: string) => Actions<TValue>) =>
    Object.keys(state.controls)
      .reduce((c, key) => {
        c[key] = callChildReducer(state.controls[key], actionCreator(state.controls[key].id));
        return c;
      }, {} as Controls<TValue>);

  switch (action.type) {
    case SetValueAction.TYPE: {
      if (state.value === action.payload.value) {
        return state;
      }

      if (action.payload.value instanceof Date) {
        throw new Error('Date values are not supported. Please used serialized strings instead.');
      }

      const value = action.payload.value;

      const controls = Object.keys(value)
        .reduce((c, key) => {
          if (!state.controls[key]) {
            c[key] = createChildState(`${state.id}.${key}`, value[key]);
          } else {
            c[key] = callChildReducer(state.controls[key], new SetValueAction(state.controls[key].id, value[key]));
          }
          return c;
        }, {} as Controls<TValue>);

      return computeGroupState(state.id, controls, value, state.errors);
    }

    case SetErrorsAction.TYPE:
      if (!action.payload.errors) {
        throw new Error(`Control errors must be an object; got ${JSON.stringify(action.payload.errors)}`); // `;
      }

      if (Object.keys(action.payload.errors).some(key => key.startsWith('_'))) {
        throw new Error(`Control errors must not use underscore as a prefix; got ${JSON.stringify(action.payload.errors)}`); // `;
      }

      if (state.errors === action.payload.errors) {
        return state;
      }

      if (isEmpty(state.errors) && isEmpty(action.payload.errors)) {
        return state;
      }

      if (state.isDisabled) {
        return state;
      }

      const childErrors =
        Object.keys(state.errors)
          .filter(key => key.startsWith('_'))
          .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {});

      const newErrors = Object.assign(childErrors, action.payload.errors);

      return computeGroupState(state.id, state.controls, state.value, newErrors);

    case MarkAsDirtyAction.TYPE: {
      if (state.isDirty) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new MarkAsDirtyAction(controlId)),
        state.value,
        state.errors,
      );
    }

    case MarkAsPristineAction.TYPE: {
      if (state.isPristine) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new MarkAsPristineAction(controlId)),
        state.value,
        state.errors,
      );
    }

    case EnableAction.TYPE: {
      if (state.isEnabled) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new EnableAction(controlId)),
        state.value,
        state.errors,
      );
    }

    case DisableAction.TYPE: {
      if (state.isDisabled) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new DisableAction(controlId)),
        state.value,
        {},
      );
    }

    case MarkAsTouchedAction.TYPE: {
      if (state.isTouched) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new MarkAsTouchedAction(controlId)),
        state.value,
        state.errors,
      );
    }

    case MarkAsUntouchedAction.TYPE: {
      if (state.isUntouched) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new MarkAsUntouchedAction(controlId)),
        state.value,
        state.errors,
      );
    }

    case MarkAsSubmittedAction.TYPE: {
      if (state.isSubmitted) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new MarkAsSubmittedAction(controlId)),
        state.value,
        state.errors,
      );
    }

    case MarkAsUnsubmittedAction.TYPE: {
      if (state.isUnsubmitted) {
        return state;
      }

      return computeGroupState(
        state.id,
        dispatchActionPerChild(controlId => new MarkAsUnsubmittedAction(controlId)),
        state.value,
        state.errors,
      );
    }

    default: {
      return state;
    }
  }
}

export function formGroupReducerInternal<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>) {
  state = groupReducer(state, action);
  state = childReducer(state, action);

  return state;
}

export function formGroupReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Action) {
  return formGroupReducerInternal(state, action as any);
}
