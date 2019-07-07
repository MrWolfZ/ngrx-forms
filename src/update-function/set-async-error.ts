import { SetAsyncErrorAction } from '../actions';
import { AbstractControlState, FormState, isFormState } from '../state';
import { abstractControlReducer, ensureState } from './util';

/**
 * This update function takes a name and a value and returns a projection
 * function that sets the async error for the given name to the given value.
 * It also marks the validation for the name as not pending anymore if it
 * was pending.
 */
export function setAsyncError(name: string, value: any): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes a form state, a name, and a value and sets the
 * async error for the given name to the given value. It also marks the
 * validation for the name as not pending anymore if it was pending.
 */
export function setAsyncError<TValue>(state: AbstractControlState<TValue>, name: string, value: any): FormState<TValue>;

export function setAsyncError<TValue>(nameOrState: string | AbstractControlState<TValue>, nameOrValue?: string | any, value?: any) {
  if (isFormState(nameOrState)) {
    return abstractControlReducer(nameOrState, new SetAsyncErrorAction(nameOrState.id, nameOrValue, value));
  }

  return (s: AbstractControlState<TValue>) => setAsyncError(ensureState(s), nameOrState, nameOrValue);
}
