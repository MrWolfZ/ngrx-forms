import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires the value to be `true`.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 */
export function requiredTrue(value: boolean | null): ValidationErrors {
  if (value === null) {
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
