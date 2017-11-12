import { Directive, ElementRef, forwardRef, Host, Optional, Renderer2 } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NgSelectOption,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
} from '@angular/forms';

// tslint:disable:directive-selector
// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix

@Directive({
  selector: 'select:not([multiple])[ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxSelectControlValueAccessor),
    multi: true,
  }],
})
export class NgrxSelectControlValueAccessor extends SelectControlValueAccessor { }

@Directive({
  selector: 'option',
})
export class NgrxSelectOption extends NgSelectOption {
  constructor(
    element: ElementRef,
    renderer: Renderer2,
    @Optional() @Host() valueAccessor: NgrxSelectControlValueAccessor,
  ) {
    super(element, renderer, valueAccessor);
  }
}

@Directive({
  selector: 'select[multiple][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxSelectMultipleControlValueAccessor),
    multi: true,
  }],
})
export class NgrxSelectMultipleControlValueAccessor extends SelectMultipleControlValueAccessor { }
