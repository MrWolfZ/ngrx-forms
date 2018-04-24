import { ValidationErrors } from 'ngrx-forms';

/**
 * A validation function that requires the value to be strictly equal (i.e. `===`)
 * to another value.
 *
 * The validation error returned by this validation function has the following shape:
 *
 * ```typescript
 * {
 *   equalTo: {
 *     comparand: T;
 *     actual: T;
 *   };
 * }
 * ```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
 * ```typescript
 * updateGroup<MyFormValue>({
 *  name: validate(equalTo('John Doe')),
 * })
 * ```
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
