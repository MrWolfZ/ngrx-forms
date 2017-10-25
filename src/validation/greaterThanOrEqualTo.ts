import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be greater than or equal to a number.
 */
export function greaterThanOrEqualTo(comparand: number, treatNullAsError = true) {
  if (comparand === null || comparand === undefined) {
    throw new Error(`The greaterThanOrEqualTo Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && value >= comparand) {
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
