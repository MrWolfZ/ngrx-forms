import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, RadioControlValueAccessor } from '@angular/forms';

// tslint:disable:directive-selector
// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix

@Directive({
  selector: 'input[type=radio][ngrxFormControlState]',
  host: {
    '(change)': 'onChange()',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxRadioControlValueAccessor),
    multi: true,
  }],
})
export class NgrxRadioControlValueAccessor extends RadioControlValueAccessor { }
