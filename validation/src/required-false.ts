import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires the value to be `false`.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 */
export function requiredFalse(value: boolean | null): ValidationErrors {
  if (value === null) {
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
