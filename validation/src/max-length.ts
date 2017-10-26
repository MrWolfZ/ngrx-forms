import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires a value to have a maximum length.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 */
export function maxLength(maxLength: number) {
  if (maxLength === null || maxLength === undefined) {
    throw new Error(`The maxLength Validation function requires the maxLength parameter to be a non-null number, got ${maxLength}!`);
  }

  return (value: string | null): ValidationErrors => {
    if (value === null) {
      return {};
    }

    const length = value.length;

    if (length <= maxLength) {
      return {};
    }

    return {
      maxLength: {
        maxLength,
        value,
        actualLength: length,
      },
    };
  };
}
