import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface EqualToValidationError<T> {
  comparand: T;
  actual: T;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    equalTo?: EqualToValidationError<any>;
  }
}

/**
 * A validation function that requires the value to be strictly equal (i.e. `===`)
 * to another value.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  equalTo: {
    comparand: T;
    actual: T;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  name: validate(equalTo('John Doe')),
})
```
 */
export function equalTo<T>(comparand: T) {
  return <TV extends T | Boxed<T> = T>(value: TV): ValidationErrors => {
    value = unbox(value) as T as TV;

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
