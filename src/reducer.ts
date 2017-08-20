import { ActionReducer, combineReducers } from '@ngrx/store';
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

export function createFormControlReducer<TValue extends SupportedNgrxFormControlValueTypes>(
  id: string,
  initialValue: TValue,
): ActionReducer<FormControlState<TValue>> {
  const initialState = createFormControlState<TValue>(id, initialValue);
  const reducer = (state = initialState, action: Actions<TValue>): FormControlState<TValue> => {
    if (action.controlId !== state.id) {
      return state;
    }

    switch (action.type) {
      case SetValueAction.TYPE:
        if (state.value === action.payload.value) {
          return state;
        }

        const valueType = typeof action.payload.value;
        if (action.payload.value !== null && ['string', 'number', 'boolean', 'undefined'].indexOf(valueType) === -1) {
          const errorMsg = `Form control states only support null or values of type "string", "number", "boolean", or "undefined"`; // `;
          throw new Error(`${errorMsg}; got ${JSON.stringify(action.payload.value)} of type "${valueType}"`); // `;
        }

        return {
          ...state,
          value: action.payload.value,
          isDirty: true,
          isPristine: false,
        };

      case SetErrorsAction.TYPE:
        if (state.errors === action.payload.errors) {
          return state;
        }

        if (!action.payload.errors) {
          throw new Error(`Control errors must be an object; got ${action.payload.errors}`); // `;
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
  };

  return reducer;
}

type Controls<TValue> = {[controlId in keyof TValue]: AbstractControlState<TValue[controlId]> };
type ControlsReducer<TValue> = {[controlId in keyof TValue]: ActionReducer<AbstractControlState<TValue[controlId]>> };

function getFormGroupValue<TValue extends { [key: string]: any }>(controls: Controls<TValue>, originalValue: TValue): TValue {
  let hasChanged = false;
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

  return hasChanged ? newErrors : originalErrors;
}

function updateChildControlsReducer<TValue extends { [key: string]: any }>(
  parentId: string,
  reducers: ControlsReducer<TValue>,
  value: TValue
): ControlsReducer<TValue> {
  return Object.keys(value)
    .map(key => {
      const createReducer = () => {
        if (reducers[key] === undefined) {
          const childValue = value[key];
          if (typeof value[key] === 'object') {
            return createFormGroupReducer(`${parentId}.${key}`, value[key]); // `;
          }

          return createFormControlReducer(`${parentId}.${key}`, value[key]); // `;
        }

        return reducers[key];
      };

      return [key, createReducer()] as [string, ActionReducer<AbstractControlState<any>>];
    })
    .reduce((res, [key, state]) => Object.assign(res, { [key]: state }), {} as ControlsReducer<TValue>);
}

export function createFormGroupReducer<TValue extends { [key: string]: any }>(
  id: string,
  initialValue: TValue,
): ActionReducer<FormGroupState<TValue>> {
  const initialState = createFormGroupState(id, initialValue);

  let childReducers = updateChildControlsReducer(id, {} as any, initialValue);
  let combinedChildReducer = combineReducers<Controls<TValue>>(childReducers);

  const childReducer = (state: FormGroupState<TValue>, action: Actions<TValue>) => {
    const controls = combinedChildReducer(state.controls, action);
    const value = getFormGroupValue<TValue>(controls, state.value);
    const errors = getFormGroupErrors(controls, state.errors);
    const isValid = isEmpty(errors);
    const isDirty = Object.keys(controls).some(key => controls[key].isDirty);
    const isEnabled = Object.keys(controls).some(key => controls[key].isEnabled);
    const isTouched = Object.keys(controls).some(key => controls[key].isTouched);
    const isSubmitted = Object.keys(controls).some(key => controls[key].isSubmitted);
    return state.controls === controls ? state : {
      ...state,
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
  };

  const groupReducer = (state = initialState, action: Actions<TValue>): FormGroupState<TValue> => {
    if (action.controlId !== state.id) {
      return state;
    }

    const dispatchActionPerChild = (actionCreator: (controlId: string) => Actions<TValue>) =>
      Object.keys(state.controls)
        .reduce((c, key) => {
          c[key] = childReducers[key](c[key], actionCreator(`${id}.${key}`)); // `;
          return c;
        }, {} as Controls<TValue>);

    switch (action.type) {
      case SetValueAction.TYPE: {
        if (state.value === action.payload.value) {
          return state;
        }

        const value = action.payload.value;
        childReducers = updateChildControlsReducer(id, childReducers, value);
        combinedChildReducer = combineReducers<Controls<TValue>>(childReducers);

        const controls = Object.keys(value)
          .reduce((c, key) => {
            c[key] = childReducers[key](c[key], new SetValueAction(`${id}.${key}`, value[key])); // `;
            return c;
          }, {} as Controls<TValue>);

        return {
          ...state,
          value,
          isDirty: true,
          isPristine: false,
          controls,
        };
      }
      case SetErrorsAction.TYPE:
        if (state.errors === action.payload.errors) {
          return state;
        }

        if (!action.payload.errors) {
          throw new Error(`Control errors must be an object; got ${JSON.stringify(action.payload.errors)}`); // `;
        }

        if (Object.keys(action.payload.errors).some(key => key.startsWith('_'))) {
          throw new Error(`Control errors must not use underscore as a prefix; got ${JSON.stringify(action.payload.errors)}`); // `;
        }

        const childErrors =
          Object.keys(state.errors)
            .filter(key => key.startsWith('_'))
            .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {});

        const newErrors = Object.assign(childErrors, action.payload.errors);

        const isValid = isEmpty(newErrors);
        return {
          ...state,
          isValid,
          isInvalid: !isValid,
          errors: newErrors,
        };

      case MarkAsDirtyAction.TYPE: {
        if (state.isDirty) {
          return state;
        }

        return {
          ...state,
          isDirty: true,
          isPristine: false,
          controls: dispatchActionPerChild(controlId => new MarkAsDirtyAction(controlId)),
        };
      }

      case MarkAsPristineAction.TYPE: {
        if (state.isPristine) {
          return state;
        }

        return {
          ...state,
          isDirty: false,
          isPristine: true,
          controls: dispatchActionPerChild(controlId => new MarkAsPristineAction(controlId)),
        };
      }

      case EnableAction.TYPE: {
        if (state.isEnabled) {
          return state;
        }

        return {
          ...state,
          isEnabled: true,
          isDisabled: false,
          controls: dispatchActionPerChild(controlId => new EnableAction(controlId)),
        };
      }

      case DisableAction.TYPE: {
        if (state.isDisabled) {
          return state;
        }

        return {
          ...state,
          isValid: true,
          isInvalid: false,
          errors: {},
          isEnabled: false,
          isDisabled: true,
          controls: dispatchActionPerChild(controlId => new DisableAction(controlId)),
        };
      }

      case MarkAsTouchedAction.TYPE: {
        if (state.isTouched) {
          return state;
        }

        return {
          ...state,
          isTouched: true,
          isUntouched: false,
          controls: dispatchActionPerChild(controlId => new MarkAsTouchedAction(controlId)),
        };
      }

      case MarkAsUntouchedAction.TYPE: {
        if (state.isUntouched) {
          return state;
        }

        return {
          ...state,
          isTouched: false,
          isUntouched: true,
          controls: dispatchActionPerChild(controlId => new MarkAsUntouchedAction(controlId)),
        };
      }

      case MarkAsSubmittedAction.TYPE: {
        if (state.isSubmitted) {
          return state;
        }

        return {
          ...state,
          isSubmitted: true,
          isUnsubmitted: false,
          controls: dispatchActionPerChild(controlId => new MarkAsSubmittedAction(controlId)),
        };
      }

      case MarkAsUnsubmittedAction.TYPE: {
        if (state.isUnsubmitted) {
          return state;
        }

        return {
          ...state,
          isSubmitted: false,
          isUnsubmitted: true,
          controls: dispatchActionPerChild(controlId => new MarkAsUnsubmittedAction(controlId)),
        };
      }

      default: {
        return state;
      }
    }
  };

  return (state: FormGroupState<TValue>, action: Actions<TValue>) => {
    state = groupReducer(state, action);
    state = childReducer(state, action);

    return state;
  };
}
