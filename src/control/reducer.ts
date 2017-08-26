import { Action } from '@ngrx/store';
import { FormControlState, createFormControlState, FormControlValueTypes } from '../state';
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
} from '../actions';
import { isEmpty } from '../util';

export function formControlReducerInternal<TValue extends FormControlValueTypes>(
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

      // TODO: deepEquals
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

export function formControlReducer<TValue extends FormControlValueTypes>(state: FormControlState<TValue>, action: Action) {
  return formControlReducerInternal(state, action as any);
}
