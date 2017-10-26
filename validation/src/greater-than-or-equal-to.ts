import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires the value to be greater than or equal to a number.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 */
export function greaterThanOrEqualTo(comparand: number) {
  if (comparand === null || comparand === undefined) {
    throw new Error(`The greaterThanOrEqualTo Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null) {
      return {};
    }

    if (value >= comparand) {
      return {};
    }

    return {
      greaterThanOrEqualTo: {
        comparand,
        actual: value,
      },
    };
  };
}
