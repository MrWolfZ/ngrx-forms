Most HTML form elements have primitive values (e.g. text inputs have `string` values, checkboxes have `boolean` values etc.). However, some form elements (e.g. `select[multiple]`) have object or array values. Since **ngrx-forms** uses the shape of the form value to infer the shape of the form state (i.e. primitive values become form controls, objects become form groups and arrays become form arrays) it is not possible to directly use objects and arrays as values of form controls. Instead, you have to _box_ the value. A boxed value is wrapped in an object that contains a marker property that allows **ngrx-forms** to infer that the value should always be a control regardless of its type.

Boxing is very simple to use. For proper type inference at compile time you have to declare a value to be boxed like this:

```typescript
import { Boxed } from 'ngrx-forms';

interface MyFormValue {
  selections: Boxed<string[]>;
}
```

Then you have to `box` the value when creating the form state:

```typescript
import { box, createFormGroupState } from 'ngrx-forms';

const formState = createFormGroupState<MyFormValue>('form ID', {
  selections: box([]),
});
```

You also need to `box` values when setting values on an existing form state:

```typescript
import { setValue, updateGroup } from 'ngrx-forms';

const updatedFormState = updateGroup<MyFormValue>(formState, {
  selections: setValue(box(['A', 'B']));
});
```

**ngrx-forms** automatically boxes object and array values set by HTML form elements if necessary. This behaviour is achieved through a default [value converter](form-controls.md#value-conversion) and can be overwritten by using a custom [value converter](form-controls.md#value-conversion).

Lastly, to access the form's value without the boxing wrapper objects you can use the `unbox` function like this:

```typescript
import { unbox } from 'ngrx-forms';

const formValueWithBoxWrapper = updatedFormState.value; // { selections: { __marker: '...', value: ['A', 'B'] } }
const unboxedFormValue = unbox(updatedFormState.value); // { selections: ['A', 'B'] }

// or access the value directly
const selectionsValue = updatedFormState.value.selections.value; // ['A', 'B']
```
