import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be non-empty.
 */
export function required<T>(value: T | null): ValidationErrors {
  if (value !== null && (value as any).length !== 0) {
    return {};
  }

  return {
    required: {
      actual: value,
    },
  };
}
