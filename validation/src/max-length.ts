import { ValidationErrors } from 'ngrx-forms';

/**
 * A validation function that requires a `string` or `array` value to have a maximum length.
 * Considers `null` as valid. Combine this function with the `required` validation
 * function if `null` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
 * ```typescript
 * {
 *   maxLength: {
 *     maxLength: number;
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
 *  name: validate(maxLength(10)),
 * })
 */
export function maxLength(maxLength: number) {
  if (maxLength === null || maxLength === undefined) {
    throw new Error(`The maxLength Validation function requires the maxLength parameter to be a non-null number, got ${maxLength}!`);
  }

  return (value: string | any[] | null): ValidationErrors => {
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
