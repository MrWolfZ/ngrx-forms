import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be less than or equal to a number.
 */
export function max(maxValue: number, treatNullAsError = true) {
  if (maxValue === null || maxValue === undefined) {
    throw new Error(`The max Validation function requires the maxValue parameter to be a non-null number, got ${maxValue}!`);
  }

  return (value: number | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && value <= maxValue) {
      return {};
    }

    return {
      max: {
        max: maxValue,
        actual: value,
      },
    };
  };
}
