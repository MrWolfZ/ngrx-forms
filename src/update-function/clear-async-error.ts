import { ClearAsyncErrorAction } from '../actions';
import { AbstractControlState, FormState, isFormState } from '../state';
import { abstractControlReducer, ensureState } from './util';

/**
 * This update function takes a name and returns a projection function that
 * clears the async error with the given name.
 */
export function clearAsyncError(name: string): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes a form state and a name, and clears the async
 * error with the given name.
 */
export function clearAsyncError<TValue>(state: AbstractControlState<TValue>, name: string): FormState<TValue>;

export function clearAsyncError<TValue>(nameOrState: string | AbstractControlState<TValue>, name?: string) {
  if (isFormState(nameOrState)) {
    return abstractControlReducer(nameOrState, new ClearAsyncErrorAction(nameOrState.id, name!));
  }

  return (s: AbstractControlState<TValue>) => clearAsyncError(ensureState(s), nameOrState);
}
