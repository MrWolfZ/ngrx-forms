import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires the value to be greater than or equal to a number.
 */
export function requiredFalse(value: boolean | null, treatNullAsError = true): ValidationErrors {
  if (value === null && treatNullAsError === false) {
    return {};
  }

  if (value === false) {
    return {};
  }

  return {
    required: {
      actual: value,
    },
  };
}
