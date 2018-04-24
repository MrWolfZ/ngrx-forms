import { ValidationErrors } from 'ngrx-forms';

export interface MaxLengthValidationError {
  maxLength: number;
  value: string;
  actualLength: number;
}

// @ts-ignore
declare module 'ngrx-forms/src/state' {
  export interface ValidationErrors {
    maxLength?: MaxLengthValidationError;
  }
}

/**
 * A validation function that requires a `string` or `array` value to have a maximum length.
 * Considers `null` and `undefined` as valid. Combine this function with the `required`
 * validation function if `null` or `undefined` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
 * ```typescript
 * {
 *   maxLength: {
 *     maxLength: number;
 *     value: string;
 *     actualLength: number;
 *   };
 * }
 * ```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
 * ```typescript
 * updateGroup<MyFormValue>({
 *  name: validate(maxLength(10)),
 * })
 */
export function maxLength(maxLengthParam: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (maxLengthParam === null || maxLengthParam === undefined) {
    throw new Error(`The maxLength Validation function requires the maxLength parameter to be a non-null number, got ${maxLengthParam}!`);
  }

  return (value: string | any[] | null | undefined): ValidationErrors => {
    if (value === null || value === undefined) {
      return {};
    }

    const length = value.length;

    if (length <= maxLengthParam) {
      return {};
    }

    return {
      maxLength: {
        maxLength: maxLengthParam,
        value,
        actualLength: length,
      },
    };
  };
}
