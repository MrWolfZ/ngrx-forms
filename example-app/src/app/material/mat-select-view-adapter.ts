import { Directive, forwardRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

// tslint:disable:directive-selector
// tslint:disable:directive-class-suffix
// necessary since material 2 does not properly export the mat-select as a NG_VALUE_ACCESSOR
@Directive({
  selector: 'mat-select[ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxMatSelectViewAdapter),
    multi: true,
  }],
})
export class NgrxMatSelectViewAdapter implements FormViewAdapter {
  constructor(private matSelect: MatSelect) { }

  setViewValue(value: any) {
    // we have to verify that the same value is not set again since that would
    // cause focus to get lost on the select since it tries to focus the active option
    const selectedOption = this.matSelect.selected;
    if (selectedOption) {
      if (Array.isArray(selectedOption) && Array.isArray(value)) {
        if (value.length === selectedOption.length && value.every((v, i) => v === selectedOption[i])) {
          return;
        }
      } else if (!Array.isArray(selectedOption)) {
        if (value === selectedOption.value) {
          return;
        }
      }
    }

    // because the options are potentially updated AFTER the value (because of their order in the DOM),
    // setting the value has to be deferred, otherwise we might select an option which is not available yet.
    Promise.resolve().then(() => this.matSelect.writeValue(value));
  }

  setOnChangeCallback(fn: any) {
    this.matSelect.registerOnChange(fn);
  }

  setOnTouchedCallback(fn: any) {
    this.matSelect.registerOnTouched(fn);
  }

  setIsDisabled(isDisabled: boolean) {
    this.matSelect.setDisabledState(isDisabled);
  }
}
