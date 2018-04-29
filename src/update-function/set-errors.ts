import { SetErrorsAction } from '../actions';
import { formStateReducer } from '../reducer';
import { AbstractControlState, FormState, isFormState, ValidationErrors } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a form state and a number of error objects and sets the
 * errors of the state.
 */
export function setErrors<TValue>(
  state: AbstractControlState<TValue>,
  errors: ValidationErrors,
  ...rest: ValidationErrors[]
): FormState<TValue>;

/**
 * This update function takes a form state and an array of error objects and sets the
 * errors of the state.
 */
export function setErrors<TValue>(
  state: AbstractControlState<TValue>,
  errorsArray: ValidationErrors[],
): FormState<TValue>;

/**
 * This update function takes a number of error objects and returns a projection
 * function that sets the errors of a form state.
 */
export function setErrors(errors: ValidationErrors, ...rest: ValidationErrors[]): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes an array of error objects and returns a projection
 * function that sets the errors of a form state.
 */
export function setErrors(errorsArray: ValidationErrors[]): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

export function setErrors<TValue>(
  errorsOrErrorsArrayOrState: ValidationErrors | ValidationErrors[] | FormState<TValue>,
  errorsOrErrorsArray?: ValidationErrors | ValidationErrors[],
  ...rest: ValidationErrors[]
) {
  if (isFormState<TValue>(errorsOrErrorsArrayOrState)) {
    const errorsArray = Array.isArray(errorsOrErrorsArray) ? errorsOrErrorsArray : [errorsOrErrorsArray!];
    const errors = errorsArray.concat(...rest).reduce((agg, err) => Object.assign(agg, err), {} as ValidationErrors);

    return formStateReducer(errorsOrErrorsArrayOrState, new SetErrorsAction(errorsOrErrorsArrayOrState.id, errors));
  }

  let errorsArray = Array.isArray(errorsOrErrorsArrayOrState) ? errorsOrErrorsArrayOrState : [errorsOrErrorsArrayOrState];
  errorsArray = errorsOrErrorsArray === undefined ? errorsArray : errorsArray.concat(errorsOrErrorsArray);
  return (s: AbstractControlState<TValue>) => setErrors<TValue>(ensureState(s), errorsArray.concat(rest));
}
