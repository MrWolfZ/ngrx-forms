import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface MinLengthValidationError {
  minLength: number;
  value: string | any[];
  actualLength: number;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    minLength?: MinLengthValidationError;
  }
}

/**
 * A validation function that requires a `string` or `array` value to have a minimum length.
 * Considers `null`, `undefined`, empty strings and empty arrays as valid. Combine this
 * function with the `required` validation function if these values should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  minLength: {
    minLength: number;
    value: string;
    actualLength: number;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  password: validate(minLength(8)),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function minLength(minLengthParam: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (minLengthParam === null || minLengthParam === undefined) {
    throw new Error(`The minLength Validation function requires the minLength parameter to be a non-null number, got ${minLengthParam}!`);
  }

  return <T extends string | Boxed<string> | any[] | Boxed<any[]> | null | undefined>(value: T): ValidationErrors => {
    value = unbox(value);

    if (value === null || value === undefined) {
      return {};
    }

    const length = (value as string | any[]).length;

    if (length === 0) {
      return {}; // don't validate empty values to allow optional controls
    }

    if (length >= minLengthParam) {
      return {};
    }

    return {
      minLength: {
        minLength: minLengthParam,
        value: value as string,
        actualLength: length,
      },
    };
  };
}
