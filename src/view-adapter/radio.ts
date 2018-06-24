import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

import { FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

// tslint:disable:directive-class-suffix

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[type=radio][ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxRadioViewAdapter),
    multi: true,
  }],
})
export class NgrxRadioViewAdapter implements FormViewAdapter, OnInit, AfterViewInit {
  private state: FormControlState<any>;
  private nativeNameWasSet = false;

  @Input() set value(val: any) {
    if (val !== this.latestValue) {
      this.latestValue = val;
      if (this.isChecked) {
        this.onChange();
      }
    }
  }

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (!value) {
      throw new Error('The control state must not be undefined!');
    }

    this.state = value;
    const nativeName = this.elementRef.nativeElement.name;
    const shouldSetNativeName = value.id !== nativeName && this.nativeNameWasSet;
    if (shouldSetNativeName) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'name', value.id);
    }
  }

  private latestValue: any;
  private isChecked: boolean;

  @HostListener('change')
  onChange: () => void = () => void 0

  @HostListener('blur')
  onTouched: () => void = () => void 0

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.isChecked = (this.elementRef.nativeElement as HTMLInputElement).checked;
  }

  ngAfterViewInit() {
    const nativeName = this.elementRef.nativeElement.name;
    const shouldSetNativeName = this.state.id !== nativeName && !nativeName;
    if (shouldSetNativeName) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'name', this.state.id);
      this.nativeNameWasSet = true;
    }
  }

  setViewValue(value: any): void {
    this.isChecked = value === this.latestValue;
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', this.isChecked);
  }

  setOnChangeCallback(fn: (_: any) => void): void {
    this.onChange = () => fn(this.latestValue);
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
