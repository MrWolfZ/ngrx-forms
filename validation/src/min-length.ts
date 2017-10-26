import { ValidationErrors } from 'ngrx-forms';

/**
 * Validation function that requires a value to have a minimum length.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 */
export function minLength(minLength: number) {
  if (minLength === null || minLength === undefined) {
    throw new Error(`The minLength Validation function requires the minLength parameter to be a non-null number, got ${minLength}!`);
  }

  return (value: string | null): ValidationErrors => {
    if (value === null) {
      return {};
    }

    const length = value.length;

    if (length >= minLength) {
      return {};
    }

    return {
      minLength: {
        minLength,
        value,
        actualLength: length,
      },
    };
  };
}
