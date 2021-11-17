import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface MaxLengthValidationError {
  maxLength: number;
  value: string | any[];
  actualLength: number;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    maxLength?: MaxLengthValidationError;
  }
}

/**
 * A validation function that requires a `string` or `array` value to have a maximum length.
 * Considers `null` and `undefined` as valid. Combine this function with the `required`
 * validation function if `null` or `undefined` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  maxLength: {
    maxLength: number;
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
  name: validate(maxLength(10)),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function maxLength(maxLengthParam: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (maxLengthParam === null || maxLengthParam === undefined) {
    throw new Error(`The maxLength Validation function requires the maxLength parameter to be a non-null number, got ${maxLengthParam}!`);
  }

  return <T extends string | Boxed<string> | any[] | Boxed<any[]> | null | undefined>(value: T): ValidationErrors => {
    value = unbox(value);

    if (value === null || value === undefined) {
      return {};
    }

    const length = (value as string | any[]).length;

    if (length <= maxLengthParam) {
      return {};
    }

    return {
      maxLength: {
        maxLength: maxLengthParam,
        value: value as string,
        actualLength: length,
      },
    };
  };
}
