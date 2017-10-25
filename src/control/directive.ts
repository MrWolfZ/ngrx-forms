import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { ActionsSubject } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FocusAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { FormControlState, FormControlValueTypes } from '../state';
import { selectValueAccessor } from '../value-accessors';
import { NgrxValueConverter, NgrxValueConverters } from './value-converter';

const CHANGE = 'change';
const BLUR = 'blur';

@Directive({
  selector: '[ngrxFormControlState]',
})
export class NgrxFormControlDirective<TStateValue extends FormControlValueTypes, TViewValue = TStateValue> implements AfterViewInit, OnDestroy {
  @Input() set ngrxFormControlState(newState: FormControlState<TStateValue>) {
    if (!newState) {
      throw new Error('The control state must not be undefined!');
    }

    if (!this.state || newState.id !== this.state.id) {
      this.stateValue = newState.value;
      this.viewValue = this.ngrxValueConverter.convertStateToViewValue(this.stateValue);
      this.valueAccessor.writeValue(this.viewValue);
    }

    this.state = newState;
    this.stateSubject$.next(newState);
  }

  @Input() ngrxUpdateOn: 'change' | 'blur' = CHANGE;
  @Input() ngrxEnableFocusTracking = false;
  @Input() ngrxValueConverter: NgrxValueConverter<TViewValue, TStateValue> = NgrxValueConverters.identity<any>();

  // TODO: move this into a separate directive
  // automatically apply the attribute that's used by the CDK to set initial focus
  @HostBinding('attr.cdk-focus-region-start') get focusRegionStartAttr() {
    return this.state && this.state.isFocused ? '' : null;
  }

  private subscriptions: Subscription[] = [];

  private state: FormControlState<TStateValue>;
  private stateSubject$ = new BehaviorSubject<FormControlState<TStateValue>>(this.state);
  private valueAccessor: ControlValueAccessor;

  // the <any> cast is required due to a mismatch in the typing of lift() between Observable and BehaviorSubject
  private get state$(): Observable<FormControlState<TStateValue>> { return this.stateSubject$ as any; }

  // we have to store the latest known state value since most input elements don't play nicely with
  // setting the same value again (e.g. input elements move the cursor to the end of the input when
  // a new value is set which means whenever the user types something the cursor is forced to the
  // end of the input) which would for example happen every time a new value is pushed to the state
  // since when the action to update the state is dispatched a new state will be received inside
  // the directive, which in turn would trigger a view update; to prevent this behavior we compare
  // the latest known state value with the value to be set and filter out those values that are equal
  // to the latest known value
  private viewValue: TViewValue;
  private stateValue: TStateValue;

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private dom: Document,
    private actionsSubject: ActionsSubject,
    @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
  ) {
    this.valueAccessor = selectValueAccessor(valueAccessors);
  }

  ngAfterViewInit() {
    if (!this.state) {
      throw new Error('The form state must not be undefined!');
    }

    const dispatchSetValueAction = () => {
      this.stateValue = this.ngrxValueConverter.convertViewToStateValue(this.viewValue);
      if (this.stateValue !== this.state.value) {
        this.actionsSubject.next(new SetValueAction(this.state.id, this.stateValue));
      }
    };

    this.valueAccessor.registerOnChange((viewValue: TViewValue) => {
      this.viewValue = viewValue;

      if (this.ngrxUpdateOn === CHANGE) {
        dispatchSetValueAction();
      }
    });

    this.valueAccessor.registerOnTouched(() => {
      if (!this.state.isTouched) {
        this.actionsSubject.next(new MarkAsTouchedAction(this.state.id));
      }

      if (this.ngrxUpdateOn === BLUR) {
        dispatchSetValueAction();
      }
    });

    this.subscriptions.push(
      this.state$
        .map(s => s.value)
        .filter(v => v !== this.stateValue)
        .do(value => this.stateValue = value)
        .map(value => this.ngrxValueConverter.convertStateToViewValue(value))
        .do(value => this.viewValue = value)
        .subscribe(value => this.valueAccessor.writeValue(value))
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
}
