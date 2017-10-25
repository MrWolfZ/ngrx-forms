import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be greater than a number.
 */
export function greaterThan(comparand: number, treatNullAsError = true) {
  if (comparand === null || comparand === undefined) {
    throw new Error(`The greaterThan Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && value > comparand) {
      return {};
    }

    return {
      greaterThan: {
        comparand,
        actual: value,
      },
    };
  };
}
