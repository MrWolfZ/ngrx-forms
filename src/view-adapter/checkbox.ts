import { Directive, forwardRef } from '@angular/core';
import { CheckboxControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// tslint:disable:directive-selector
// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix

@Directive({
  selector: 'input[type=checkbox][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.checked)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxCheckboxViewAdapter),
    multi: true,
  }],
})
export class NgrxCheckboxViewAdapter extends CheckboxControlValueAccessor { }
