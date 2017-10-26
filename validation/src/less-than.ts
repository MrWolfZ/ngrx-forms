import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires the value to be less than a number.
 */
export function lessThan(comparand: number, treatNullAsError = true) {
  if (comparand === null || comparand === undefined) {
    throw new Error(`The lessThan Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && value < comparand) {
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
