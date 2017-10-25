import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be less than or equal to a number.
 */
export function lessThanOrEqualTo(comparand: number, treatNullAsError = true) {
  if (comparand === null || comparand === undefined) {
    throw new Error(`The lessThanOrEqualTo Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && value <= comparand) {
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
