import { Directive, ElementRef, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// tslint:disable:directive-selector
// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix
// tslint:disable:triple-equals

@Directive({
  selector: 'input[type=range][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxRangeViewAdapter),
    multi: true,
  }],
})
export class NgrxRangeViewAdapter implements ControlValueAccessor {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  onChange = (_: any) => void 0 as any;
  onTouched = () => void 0 as any;

  writeValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', parseFloat(value));
  }

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => { fn(value == '' ? null : parseFloat(value)); };
  }

  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
