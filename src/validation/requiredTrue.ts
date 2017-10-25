import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be true.
 */
export function requiredTrue(value: boolean | null, treatNullAsError = true): ValidationErrors {
  if (value === null && treatNullAsError === false) {
    return {};
  }

  if (value === true) {
    return {};
  }

  return {
    required: {
      actual: value,
    },
  };
}
