import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires the value to be less than or equal to a number.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 */
export function lessThanOrEqualTo(comparand: number) {
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
