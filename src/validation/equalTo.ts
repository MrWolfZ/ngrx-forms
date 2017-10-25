import { ValidationErrors } from '../state';

/**
 * Validation function that requires the value to be equal to another value.
 */
export function equalTo<T>(comparand: T) {
  return (value: T): ValidationErrors => {
    if (value === comparand) {
      return {};
    }

    return {
      equalTo: {
        comparand,
        actual: value,
      },
    };
  };
}
