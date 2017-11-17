import { ValidationErrors } from 'ngrx-forms';

/**
 * A validation function that requires the value to be less than a number.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
 * ```typescript
 * {
 *   lessThan: {
 *     comparand: number;
 *     actual: number;
 *   };
 * }
 * ```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
 * ```typescript
 * updateGroup<MyFormValue>({
 *  amount: validate(lessThan(10)),
 * })
 */
export function lessThan(comparand: number) {
  if (comparand === null || comparand === undefined) {
    throw new Error(`The lessThan Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null) {
      return {};
    }

    if (value < comparand) {
      return {};
    }

    return {
      lessThan: {
        comparand,
        actual: value,
      },
    };
  };
}
