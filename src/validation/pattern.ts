import { ValidationErrors } from '../state';

/**
 * Validation function that requires a value to match a regex.
 */
export function pattern(pattern: RegExp, treatNullAsError = true) {
  if (pattern === null || pattern === undefined) {
    throw new Error(`The pattern Validation function requires the pattern parameter to be a non-null string or regular expression, got ${pattern}!`);
  }

  return (value: string | null): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value !== null && pattern.test(value)) {
      return {};
    }

    return {
      pattern: {
        pattern: pattern.toString(),
        actual: value,
      },
    };
  };
}
