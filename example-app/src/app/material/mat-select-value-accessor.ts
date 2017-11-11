import { Directive, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material';

// tslint:disable:directive-selector
// tslint:disable:directive-class-suffix
// necessary since material 2 does not properly declare the md-select as a NG_VALUE_ACCESSOR
@Directive({
  selector: 'mat-select[ngrxFormControlState]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxMatSelectValueAccessor),
    multi: true
  }]
})
export class NgrxMatSelectValueAccessor implements ControlValueAccessor {
  constructor(private matSelect: MatSelect) { }

  writeValue(value: any) {
    // we have to verify that the same value is not set again since that would
    // cause focs to get lost on the select since it tries to focus the active option
    const selectedOption = this.matSelect.selected;
    if (selectedOption) {
      if (Object.prototype.toString.call(selectedOption) !== '[object Array]') {
        const selectedValue = (<MatOption>selectedOption).value;
        if (value === selectedValue) {
          return;
        }
      } else {
        // TODO: handle multi selection
      }
    }

    // because the options are potentially updated AFTER the value (because of their order in the DOM),
    // setting the value has to be deferred, otherwise we might select an option which is not available yet.
    Promise.resolve().then(() => this.matSelect.writeValue(value));
  }

  registerOnChange(fn: any) {
    this.matSelect.registerOnChange(fn);
  }

  registerOnTouched(fn: any) {
    this.matSelect.registerOnTouched(fn);
  }
}
