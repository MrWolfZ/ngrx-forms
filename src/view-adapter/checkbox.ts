import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';

import { FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

// tslint:disable:directive-class-suffix

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[type=checkbox][ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxCheckboxViewAdapter),
    multi: true,
  }],
})
export class NgrxCheckboxViewAdapter implements FormViewAdapter, AfterViewInit {
  private state: FormControlState<any>;
  private nativeIdWasSet = false;

  onChange: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (!value) {
      throw new Error('The control state must not be undefined!');
    }

    this.state = value;
    const nativeId = this.elementRef.nativeElement.id;
    const shouldSetNativeId = value.id !== nativeId && this.nativeIdWasSet;
    if (shouldSetNativeId) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', value.id);
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngAfterViewInit() {
    const nativeId = this.elementRef.nativeElement.id;
    const shouldSetNativeId = this.state.id !== nativeId && !nativeId;
    if (shouldSetNativeId) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', this.state.id);
      this.nativeIdWasSet = true;
    }
  }

  setViewValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', value);
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
  handleInput({ target }: { target: HTMLInputElement }): void {
    this.onChange(target.checked);
  }
}
