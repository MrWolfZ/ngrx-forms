import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface PatternValidationError {
  pattern: string;
  actual: string;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    pattern?: PatternValidationError;
  }
}

/**
 * A validation function that requires a value to match a regex.
 * Considers `null`, `undefined`, and `''` as valid. Combine this function with the
 * `required` validation function if these values should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  pattern: {
    pattern: string;
    actual: string;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  numberWithPeriodsOrCommas: validate(pattern(/^[0-9.,]+$/)),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function pattern(patternParam: RegExp) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (patternParam === null || patternParam === undefined) {
    throw new Error(`The pattern Validation function requires the pattern parameter to be a non-null string or regular expression, got ${patternParam}!`);
  }

  return <T extends string | Boxed<string> | null | undefined>(value: T): ValidationErrors => {
    value = unbox(value) as string | null | undefined as T;

    if (value === null || value === undefined || (value as string).length === 0) {
      return {};
    }

    if (patternParam.test(value as string)) {
      return {};
    }

    return {
      pattern: {
        pattern: patternParam.toString(),
        actual: value as string,
      },
    };
  };
}
