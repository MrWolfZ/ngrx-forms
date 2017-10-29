import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { ActionsSubject } from '@ngrx/store';

import { FocusAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { FormControlState, FormControlValueTypes } from '../state';
import { selectValueAccessor } from '../value-accessors';
import { NgrxValueConverter, NgrxValueConverters } from './value-converter';

const CHANGE = 'change';
const BLUR = 'blur';

@Directive({
  selector: '[ngrxFormControlState]',
})
export class NgrxFormControlDirective<TStateValue extends FormControlValueTypes, TViewValue = TStateValue> implements AfterViewInit, OnInit {
  @Input() set ngrxFormControlState(newState: FormControlState<TStateValue>) {
    if (!newState) {
      throw new Error('The control state must not be undefined!');
    }

    const oldState = this.state;
    this.state = newState;

    this.updateViewIfControlIdChanged(newState, oldState);
    this.updateViewIfValueChanged(newState, oldState);
    this.updateViewIfIsDisabledChanged(newState, oldState);
    this.updateViewIfIsFocusedChanged(newState, oldState);
  }

  @Input() ngrxUpdateOn: 'change' | 'blur' = CHANGE;
  @Input() ngrxEnableFocusTracking = false;
  @Input() ngrxValueConverter: NgrxValueConverter<TViewValue, TStateValue> = NgrxValueConverters.identity<any>();

  // TODO: move this into a separate directive
  // automatically apply the attribute that's used by the CDK to set initial focus
  @HostBinding('attr.cdk-focus-region-start') get focusRegionStartAttr() {
    return this.state && this.state.isFocused ? '' : null;
  }

  state: FormControlState<TStateValue>;

  private valueAccessor: ControlValueAccessor;

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

  updateViewIfControlIdChanged(newState: FormControlState<TStateValue>, oldState: FormControlState<TStateValue>) {
    if (oldState && newState.id === oldState.id) {
      return;
    }

    this.stateValue = newState.value;
    this.viewValue = this.ngrxValueConverter.convertStateToViewValue(this.stateValue);
    this.valueAccessor.writeValue(this.viewValue);
    if (this.valueAccessor.setDisabledState) {
      this.valueAccessor.setDisabledState(newState.isDisabled);
    }
  }

  updateViewIfValueChanged(newState: FormControlState<TStateValue>, oldState: FormControlState<TStateValue>) {
    if (newState.value === this.stateValue) {
      return;
    }

    this.stateValue = newState.value;
    this.viewValue = this.ngrxValueConverter.convertStateToViewValue(newState.value);
    this.valueAccessor.writeValue(this.viewValue);
  }

  updateViewIfIsDisabledChanged(newState: FormControlState<TStateValue>, oldState: FormControlState<TStateValue>) {
    if (!this.valueAccessor.setDisabledState) {
      return;
    }

    if (oldState && newState.isDisabled === oldState.isDisabled) {
      return;
    }

    this.valueAccessor.setDisabledState(newState.isDisabled);
  }

  updateViewIfIsFocusedChanged(newState: FormControlState<TStateValue>, oldState: FormControlState<TStateValue>) {
    if (oldState && newState.isFocused === oldState.isFocused) {
      return;
    }

    if (newState.isFocused) {
      this.el.nativeElement.focus();
    } else {
      this.el.nativeElement.blur();
    }
  }

  ngOnInit() {
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
  }

  ngAfterViewInit() {
    // we need to update the view again after it was initialized since some
    // controls depend on child elements for setting the value (e.g. selects)
    this.valueAccessor.writeValue(this.viewValue);
    if (this.valueAccessor.setDisabledState) {
      this.valueAccessor.setDisabledState(this.state.isDisabled);
    }
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
