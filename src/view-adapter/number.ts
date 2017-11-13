import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';

import { FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

// tslint:disable:directive-class-suffix

@Directive({
  selector: 'input[type=number][ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxNumberViewAdapter),
    multi: true,
  }],
})
// for some reason @angular/forms does not export the NumberValueAccessor, so we have to copy the implementation here
export class NgrxNumberViewAdapter implements FormViewAdapter {
  onChange: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (value.id !== this.elementRef.nativeElement.id) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', value.id);
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  setViewValue(value: any): void {
    // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
    const normalizedValue = value === null ? '' : value;
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
  }

  setOnChangeCallback(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('change', ['$event'])
  @HostListener('input', ['$event'])
  handleInput(event: UIEvent): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value === '' ? null : parseFloat(value));
  }
}
