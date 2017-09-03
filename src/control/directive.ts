import {
  Directive,
  ElementRef,
  Input,
  Inject,
  HostListener,
  HostBinding,
  AfterViewInit,
  OnDestroy,
  Self,
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

import {
  SetValueAction,
  MarkAsTouchedAction,
  FocusAction,
  UnfocusAction,
  SetLastKeyDownCodeAction,
} from '../actions';
import { FormControlState, FormControlValueTypes } from '../state';
import { selectValueAccessor } from '../value-accessors';

const CHANGE = 'change';
const BLUR = 'blur';

@Directive({
  selector: '[ngrxFormControlState]',
})
export class NgrxFormControlDirective<TValue extends FormControlValueTypes> implements AfterViewInit, OnDestroy {
  @Input() set ngrxFormControlState(newState: FormControlState<TValue>) {
    if (!newState) {
      throw new Error('The control state must not be undefined!');
    }

    if (this.state && newState.id !== this.state.id) {
      this.viewValueIsKnown = false;
      this.viewValue = undefined as any;
    }

    this.state = newState;
    this.stateSubject$.next(newState);
  }

  @Input() ngrxUpdateOn: typeof CHANGE | typeof BLUR = CHANGE;
  @Input() ngrxEnableFocusTracking = false;
  @Input() ngrxEnableLastKeydownCodeTracking = false;

  // TODO: move this into a separate directive
  // automatically apply the attribute that's used by the CDK to set initial focus
  @HostBinding('attr.cdk-focus-region-start') get focusRegionStartAttr() {
    return this.state && this.state.isFocused ? '' : null;
  }

  private subscriptions: Subscription[] = [];

  private state: FormControlState<TValue>;
  private stateSubject$ = new BehaviorSubject<FormControlState<TValue>>(this.state);
  private valueAccessor: ControlValueAccessor;

  // the <any> cast is required due to a mismatch in the typing of lift() between Observable and BehaviorSubject
  private get state$(): Observable<FormControlState<TValue>> { return this.stateSubject$ as any; }

  // we have to store the last reported value since when the action to update the state
  // is dispatched a new state will be received inside the directive, which in turn would
  // trigger a view update; however, most input elements move the cursor to the end of the
  // input when a new value is written programmatically which means whenever the user
  // types something the cursor is forced to the end of the input; to prevent this
  // behavior we compare the last reported value with the value to be set and filter out
  // those values that are equal to the last reported value
  private viewValueIsKnown: boolean;
  private viewValue: TValue;

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private dom: Document,
    private actionsSubject: ActionsSubject,
    @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
  ) {
    this.valueAccessor = selectValueAccessor(valueAccessors);
  }

  @Input() convertViewValue: (value: any) => TValue = value => value;
  @Input() convertModelValue: (value: TValue) => any = value => value;

  ngAfterViewInit() {
    if (!this.state) {
      throw new Error('The form state must not be undefined!');
    }

    this.valueAccessor.registerOnChange((newValue: TValue) => {
      newValue = this.convertViewValue(newValue);
      this.viewValueIsKnown = true;
      this.viewValue = newValue;

      if (this.viewValue !== this.state.value && this.ngrxUpdateOn === CHANGE) {
        this.actionsSubject.next(new SetValueAction(this.state.id, this.viewValue));
      }
    });

    this.valueAccessor.registerOnTouched(() => {
      if (!this.state.isTouched) {
        this.actionsSubject.next(new MarkAsTouchedAction(this.state.id));
      }

      if (this.viewValue !== this.state.value && this.ngrxUpdateOn === BLUR) {
        this.actionsSubject.next(new SetValueAction(this.state.id, this.viewValue));
      }
    });

    this.subscriptions.push(
      this.state$
        .map(s => this.convertModelValue(s.value))
        .filter(v => !this.viewValueIsKnown || v !== this.viewValue)
        .subscribe(value => {
          this.valueAccessor.writeValue(value);
          this.viewValueIsKnown = true;
          this.viewValue = value;
        })
    );

    if (this.valueAccessor.setDisabledState) {
      this.subscriptions.push(
        this.state$
          .map(s => ({ id: s.id, isDisabled: s.isDisabled }))
          .distinctUntilChanged((l, r) => l.id === r.id && l.isDisabled === r.isDisabled)
          .map(s => s.isDisabled)
          .subscribe(isDisabled => this.valueAccessor.setDisabledState!(isDisabled))
      );
    }

    this.subscriptions.push(
      this.state$
        .map(s => ({ id: s.id, isFocused: s.isFocused }))
        .distinctUntilChanged((l, r) => l.id === r.id && l.isFocused === r.isFocused)
        .map(s => s.isFocused)
        .subscribe(isFocused => {
          if (isFocused) {
            this.el.nativeElement.focus();
          } else {
            this.el.nativeElement.blur();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('focusin')
  @HostListener('focusout')
  onFocusChange() {
    if (!this.ngrxEnableFocusTracking) {
      return;
    }

    const isControlFocused = this.el.nativeElement === this.dom.activeElement;
    if (isControlFocused !== this.state.isFocused) {
      this.actionsSubject.next(isControlFocused ? new FocusAction(this.state.id) : new UnfocusAction(this.state.id));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.ngrxEnableLastKeydownCodeTracking) {
      return;
    }

    if (event.keyCode !== this.state.lastKeyDownCode) {
      this.actionsSubject.next(new SetLastKeyDownCodeAction(this.state.id, event.keyCode));
    }
  }
}
