import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

// this regex is taken from the @angular/forms source code
// tslint:disable-next-line:max-line-length
export const NGRX_FORMS_EMAIL_VALIDATION_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export interface EmailValidationError {
  pattern: string;
  actual: string;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    email?: EmailValidationError;
  }
}

/**
 * A validation function that requires a value to be a valid e-mail address.
 * Considers `null`, `undefined`, and `''` as valid. Combine this function with the
 * `required` validation function if these values should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  email: {
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
  userMailAddress: validate(email),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function email<T extends string | Boxed<string> | null | undefined>(value: T): ValidationErrors {
  value = unbox(value) as string | null | undefined as T;

  if (value === null || value === undefined || (value as string).length === 0) {
    return {};
  }

  if (NGRX_FORMS_EMAIL_VALIDATION_REGEXP.test(value as string)) {
    return {};
  }

  return {
    email: {
      pattern: NGRX_FORMS_EMAIL_VALIDATION_REGEXP.toString(),
      actual: value as string,
    },
  };
}
