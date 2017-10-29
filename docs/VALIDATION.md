## Validation

As mentioned in the section about updating the state the `validate` update function takes a function as a parameter that validates the value of a form control or group. `ngrx-forms` provides a set of validation functions out of the box (imported via `ngrx-forms/validation`) that can be used as arguments to `validate`. Most of these functions treat `null` (and for `email` and `pattern` empty strings) as valid to allow for optional form controls. If the control is not optional simply combine the corresponding validation function with the `required` validation function.

|Function|Description|
|-|-|
|`required`|Requires the value to be non-empty (i.e. non-`null`, non-empty `string` etc.)|
|`requiredTrue`|Requires the `boolean` value to be `true`|
|`requiredFalse`|Requires the `boolean` value to be `false`|
|`equalTo`|Requires the value to be equal to another value|
|`lessThan`|Requires the `number` value to be less than another number|
|`lessThanOrEqualTo`|Requires the `number` value to be less than or equal to another number|
|`greaterThan`|Requires the `number` value to be greater than another number|
|`greaterThanOrEqualTo`|Requires the `number` value to be greater than or equal to another number|
|`minLength`|Requires a `string` value to have a minimum length|
|`maxLength`|Requires a `string` value to have a maximum length|
|`email`|Requires a `string` value to be a valid e-mail address|
|`pattern`|Requires a `string` value to match a regular expression|

Below you can see an example of how these functions can be used:

```typescript
import { updateGroup, validate } from 'ngrx-forms';
import { required, greaterThanOrEqualTo, lessThan } from 'ngrx-forms/validation';

export interface NestedValue {
  someNumber: number;
}

export interface MyFormValue {
  someTextInput: string;
  someCheckbox: boolean;
  nested: NestedValue;
}

const updateMyFormGroup = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate([required, greaterThanOrEqualTo(2), lessThan(10)]),
  }),
});
```
