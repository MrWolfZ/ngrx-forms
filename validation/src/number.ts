import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface NumberValidationError<T> {
  actual: T;
}

// @ts-ignore
declare module 'ngrx-forms/src/state' {
  export interface ValidationErrors {
    number?: NumberValidationError<any>;
  }
}

/**
 * A validation function that requires a value to be a valid number.
 * Considers `null` and `undefined` as valid. Combine this function with the
 * `required` validation function if these values should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  number: {
    actual: any;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  amount: validate(number),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function number<T extends number | Boxed<number> | null | undefined>(value: T): ValidationErrors {
  value = unbox(value) as number | null | undefined as T;

  if (value === null || value === undefined || typeof value === 'number') {
    return {};
  }

  return {
    number: {
      actual: value,
    },
  };
}
