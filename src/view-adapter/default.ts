import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Inject, Input, Optional, PLATFORM_ID, Renderer2 } from '@angular/core';

import { FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

export interface Navigator {
  userAgent: string;
}

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function isAndroid(navigator: Navigator): boolean {
  return /android (\d+)/.test(navigator.userAgent.toLowerCase());
}

// tslint:disable:directive-class-suffix
// tslint:disable:directive-selector

// TODO: since this directive has a side-effect (setting the element's id attribute)
// it should not blacklist other types of inputs but instead it should somehow figure
// out whether it is the "active" view adapter and only perform its side effects if it
// is active
@Directive({
  selector: 'input:not([type=checkbox]):not([type=number]):not([type=radio]):not([type=range])[ngrxFormControlState],textarea[ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxDefaultViewAdapter),
    multi: true,
  }],
})
export class NgrxDefaultViewAdapter implements FormViewAdapter, AfterViewInit {
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

  /** Whether the user is creating a composition string (IME events). */
  private isComposing = false;
  private isCompositionSupported: boolean;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Optional() @Inject(PLATFORM_ID) private platformId: string | null = null,
    // we use a special injection string that should never exist at runtime to allow mocking this dependency for testing
    @Optional() @Inject('ngrx-forms/never') navigator: Navigator | null = null,
  ) {
    this.isCompositionSupported = isPlatformBrowser(this.platformId || '') && !isAndroid(navigator || window.navigator);
  }

  ngAfterViewInit() {
    const nativeId = this.elementRef.nativeElement.id;
    const shouldSetNativeId = this.state.id !== nativeId && !nativeId;
    if (shouldSetNativeId) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', this.state.id);
      this.nativeIdWasSet = true;
    }
  }

  setViewValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
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

  @HostListener('input', ['$event'])
  handleInput({ target }: { target: HTMLInputElement }): void {
    if (this.isCompositionSupported && this.isComposing) {
      return;
    }

    this.onChange(target.value);
  }

  @HostListener('compositionstart')
  compositionStart(): void {
    this.isComposing = true;
  }

  @HostListener('compositionend', ['$event'])
  compositionEnd({ target }: { target: HTMLInputElement }): void {
    this.isComposing = false;
    if (this.isCompositionSupported) {
      this.onChange(target.value);
    }
  }
}
