import { ValidationErrors } from '../state';

/**
 * Validation function that requires a value to have a maximum length.
 */
export function maxLength(maxLength: number, treatNullAsError = true) {
  if (maxLength === null || maxLength === undefined) {
    throw new Error(`The maxLength Validation function requires the maxLength parameter to be a non-null number, got ${maxLength}!`);
  }

  return (value: string | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    const length = (value || '').length;

    if (value !== null && length <= maxLength) {
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
