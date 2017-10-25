import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be greater than or equal to a number.
 */
export function min(minValue: number, treatNullAsError = true) {
  if (minValue === null || minValue === undefined) {
    throw new Error(`The min Validation function requires the minValue parameter to be a non-null number, got ${minValue}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && value >= minValue) {
      return {};
    }

    return {
      min: {
        min: minValue,
        actual: value,
      },
    };
  };
}
