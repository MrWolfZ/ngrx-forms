import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface LessThanOrEqualToValidationError {
  comparand: number;
  actual: number;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    lessThanOrEqualTo?: LessThanOrEqualToValidationError;
  }
}

/**
 * A validation function that requires the value to be less than or equal to a number.
 * Considers `null`, `undefined` and non-numeric values as valid. Combine this function with the `required`
 * validation function if `null` or `undefined` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  lessThanOrEqualTo: {
    comparand: number;
    actual: number;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  amount: validate(lessThanOrEqualTo(10)),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function lessThanOrEqualTo(comparand: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (comparand === null || comparand === undefined) {
    throw new Error(`The lessThanOrEqualTo Validation function requires the comparand parameter to be a non-null number, got ${comparand}!`);
  }

  return <T extends number | Boxed<number> | null | undefined>(value: T): ValidationErrors => {
    value = unbox(value) as number | null | undefined as T;

    if (value === null || value === undefined || typeof value !== 'number') {
      return {};
    }

    if (value <= comparand) {
      return {};
    }

    return {
      lessThanOrEqualTo: {
        comparand,
        actual: value as number,
      },
    };
  };
}
