import { ValidationErrors } from '../state';

/**
 * Validation function that requires a value to have a minimum length.
 */
export function minLength(minLength: number, treatNullAsError = true) {
  if (minLength === null || minLength === undefined) {
    throw new Error(`The minLength Validation function requires the minLength parameter to be a non-null number, got ${minLength}!`);
  }

  return (value: string | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    const length = (value || '').length;

    if (value !== null && length >= minLength) {
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
