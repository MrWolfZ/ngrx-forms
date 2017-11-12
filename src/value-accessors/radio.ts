import { Directive, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormControlState } from '../state';

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
export class NgrxRadioControlValueAccessor implements ControlValueAccessor {
  @Input() set value(val: any) {
    if (val !== this.latestValue) {
      this.latestValue = val;
      this.onChange();
    }
  }

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (value.id !== this.elementRef.nativeElement.name) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'name', value.id);
    }
  }

  private latestValue: any;
  private isChecked: boolean;
  private onChange: () => void = () => void 0;
  private onTouched: () => void = () => void 0;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) { }

  writeValue(value: any): void {
    this.isChecked = value === this.latestValue;
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', this.isChecked);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = () => fn(this.latestValue);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
