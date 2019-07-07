import { StartAsyncValidationAction } from '../actions';
import { AbstractControlState, FormState, isFormState } from '../state';
import { abstractControlReducer, ensureState } from './util';

/**
 * This update function takes a name and returns a projection function that
 * marks the async validation for the given name as pending.
 */
export function startAsyncValidation(name: string): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes a form state and a name and marks the async
 * validation for the given name as pending.
 */
export function startAsyncValidation<TValue>(state: AbstractControlState<TValue>, name: string): FormState<TValue>;

export function startAsyncValidation<TValue>(nameOrState: string | AbstractControlState<TValue>, name?: string) {
  if (isFormState(nameOrState)) {
    return abstractControlReducer(nameOrState, new StartAsyncValidationAction(nameOrState.id, name!));
  }

  return (s: AbstractControlState<TValue>) => startAsyncValidation(ensureState(s), nameOrState);
}
