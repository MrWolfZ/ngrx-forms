import { ValidationErrors } from 'ngrx-forms';

/**
 * A validation function that requires a `string` value to have a minimum length.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
 * ```typescript
 * {
 *   minLength: {
 *     minLength: number;
 *     value: string;
 *     actualLength: number;
 *   };
 * }
 * ```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
 * ```typescript
 * updateGroup<MyFormValue>({
 *  password: validate(minLength(8)),
 * })
 */
export function minLength(minLength: number) {
  if (minLength === null || minLength === undefined) {
    throw new Error(`The minLength Validation function requires the minLength parameter to be a non-null number, got ${minLength}!`);
  }

  return (value: string | any[] | null): ValidationErrors => {
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
