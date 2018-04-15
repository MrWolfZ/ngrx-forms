import { ValidationErrors } from 'ngrx-forms';

/**
 * A validation function that requires the value to be less than or equal to a number.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
 * ```typescript
 * {
 *   lessThanOrEqualTo: {
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
 *  amount: validate(lessThanOrEqualTo(10)),
 * })
 */
export function lessThanOrEqualTo(comparand: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (comparand === null || comparand === undefined) {
    throw new Error(`The lessThanOrEqualTo Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null) {
      return {};
    }

    if (value <= comparand) {
      return {};
    }

    return {
      lessThanOrEqualTo: {
        comparand,
        actual: value,
      },
    };
  };
}
