import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

/**
 * A validation function that requires the value to be `true`. Considers `null` and
 * `undefined` as valid. Combine this function with the `required` validation
 * function if `null` or `undefined` should be considered invalid.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  required: {
    actual: boolean;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  agreeWithTermsOfService: validate(requiredTrue),
})
```
 *
 * Note that this function is generic to allow the compiler to properly infer the type
 * of the `validate` function for both optional and non-optional controls.
 */
export function requiredTrue<T extends boolean | Boxed<boolean> | null | undefined>(value: T): ValidationErrors {
  value = unbox(value) as boolean | null | undefined as T;

  // tslint:disable-next-line:strict-type-predicates
  if (value === null || value === undefined) {
    return {};
  }

  if (value) {
    return {};
  }

  return {
    required: {
      actual: value,
    },
  };
}
