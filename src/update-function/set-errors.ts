import { SetErrorsAction } from '../actions';
import { inferredStateReducer } from '../inferred-reducer';
import { AbstractControlState, InferredControlState, isFormState, ValidationErrors } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a form state and a number of error objects and sets the
 * errors of the state.
 */
export function setErrors<TValue>(
  state: AbstractControlState<TValue>,
  errors: ValidationErrors,
  ...rest: ValidationErrors[]
): InferredControlState<TValue>;

/**
 * This update function takes a form state and an array of error objects and sets the
 * errors of the state.
 */
export function setErrors<TValue>(
  state: AbstractControlState<TValue>,
  errorsArray: ValidationErrors[],
): InferredControlState<TValue>;

/**
 * This update function takes a number of error objects and returns a projection
 * function that sets the errors of a form state.
 */
export function setErrors<TValue>(errors: ValidationErrors, ...rest: ValidationErrors[]): (state: AbstractControlState<TValue>) => InferredControlState<TValue>;

/**
 * This update function takes an array of error objects and returns a projection
 * function that sets the errors of a form state.
 */
export function setErrors<TValue>(errorsArray: ValidationErrors[]): (state: AbstractControlState<TValue>) => InferredControlState<TValue>;

export function setErrors<TValue>(
  errorsOrErrorsArrayOrState: ValidationErrors | ValidationErrors[] | AbstractControlState<TValue>,
  errorsOrErrorsArray?: ValidationErrors | ValidationErrors[],
  ...rest: ValidationErrors[]
) {
  if (isFormState(errorsOrErrorsArrayOrState)) {
    const errorsArray = Array.isArray(errorsOrErrorsArray) ? errorsOrErrorsArray : [errorsOrErrorsArray!];
    const errors = errorsArray.concat(...rest).reduce((agg, err) => Object.assign(agg, err), {} as ValidationErrors);

    return inferredStateReducer(errorsOrErrorsArrayOrState, new SetErrorsAction(errorsOrErrorsArrayOrState.id, errors));
  }

  let errorsArray = Array.isArray(errorsOrErrorsArrayOrState) ? errorsOrErrorsArrayOrState : [errorsOrErrorsArrayOrState];
  errorsArray = errorsOrErrorsArray === undefined ? errorsArray : errorsArray.concat(errorsOrErrorsArray);
  return (s: AbstractControlState<TValue>) => setErrors<TValue>(ensureState(s), errorsArray.concat(rest));
}
