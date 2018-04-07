import { Component } from '@angular/core';
import { createFormControlState, FormControlState } from 'ngrx-forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// workaround for debugging app while not being connected to a debugger
const logs: string[] = [];
console.log = (message, ...args) => {
  logs.push(message);
  args.forEach(a => logs.push(a));
};

console.error = (message, ...args) => {
  logs.push(message);
  args.forEach(a => logs.push(a));
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-app',
  template: `
    <ActionBar title="My App" class="action-bar"></ActionBar>
    <StackLayout orientation="vertical">
      <TextField hint="Input" [ngrxFormControlState]="controlState$ | async"></TextField>
      <Label [text]="(controlState$ | async).value"></Label>
      <Label *ngFor="let l of logs" [text]="l"></Label>
    </StackLayout>
  `,
})
export class AppComponent {
  controlState$: Observable<FormControlState<string>>;
  logs = logs;

  constructor(store: Store<any>) {
    this.controlState$ = store.select(s => s.controlState);
  }
}

import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';

import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

// tslint:disable:directive-class-suffix

@Directive({
  selector: 'TextField[ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxTextFieldViewAdapter),
    multi: true,
  }],
})
export class NgrxTextFieldViewAdapter implements FormViewAdapter {
  onChange: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (!value) {
      throw new Error('The control state must not be undefined!');
    }
  }

  setViewValue(value: any): void {
    // const normalizedValue = value == null ? '' : value;
    // this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
  }

  setOnChangeCallback(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    // this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('textChange', ['$event'])
  handleInput(event: any): void {
    this.onChange(event.object.text);
  }
}
