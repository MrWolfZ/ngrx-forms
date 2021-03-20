import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface ExclusiveBetweenValidationError {
  min: number;
  max: number;
  actual: number;
}

// @ts-ignore
declare module 'ngrx-forms/src/state' {
  export interface ValidationErrors {
    exclusiveBetween?: ExclusiveBetweenValidationError;
  }
}

/**
 * A validation function that requires the value to be between the given min and max values.
 * Considers `null`, `undefined` and non-numeric values as valid. Combine this function with the `required`
 * validation function if `null` or `undefined` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
 ```typescript
 {
  exclusiveBetween: {
  min: number;
  max: number;
  actual: number;
  };
}
 ```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
 ```typescript
 updateGroup<MyFormValue>({
  amount: validate(exclusiveBetween(0, 100)),
})
 ```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function exclusiveBetween(min: number, max: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (min === null || min === undefined || max === null || max === undefined) {
    throw new Error(`The exclusiveBetween Validation function requires the min and max parameters to be a non-null number, got ${min} and ${max}!`);
  }

  return <T extends number | Boxed<number> | null | undefined>(value: T): ValidationErrors => {
    value = unbox(value) as number | null | undefined as T;

    if (value === null || value === undefined || typeof value !== 'number') {
      return {};
    }

    if (min < value && value < max) {
      return {};
    }

    return {
      exclusiveBetween: {
        min,
        max,
        actual: value as number,
      },
    };
  };
}
