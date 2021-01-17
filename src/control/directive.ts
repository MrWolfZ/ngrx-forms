import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionsSubject } from '@ngrx/store';

import { Actions, FocusAction, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { FormControlState, FormControlValueTypes } from '../state';
import { selectViewAdapter } from '../view-adapter/util';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NgrxValueConverter, NgrxValueConverters } from './value-converter';

export interface Document {
  activeElement: any;
}

export enum NGRX_UPDATE_ON_TYPE {
  CHANGE = 'change',
  BLUR = 'blur',
  NEVER = 'never',
}

class ControlValueAccessorAdapter implements FormViewAdapter {
  constructor(private valueAccessor: ControlValueAccessor) { }

  setViewValue(value: any): void {
    this.valueAccessor.writeValue(value);
  }

  setOnChangeCallback(fn: (value: any) => void): void {
    this.valueAccessor.registerOnChange(fn);
  }
  setOnTouchedCallback(fn: () => void): void {
    this.valueAccessor.registerOnTouched(fn);
  }

  setIsDisabled(isDisabled: boolean) {
    if (this.valueAccessor.setDisabledState) {
      this.valueAccessor.setDisabledState(isDisabled);
    }
  }
}

export type NgrxFormControlValueType<TStateValue> = TStateValue extends FormControlValueTypes ? TStateValue : never;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: ':not([ngrxFormsAction])[ngrxFormControlState]',
})
export class NgrxFormControlDirective<TStateValue, TViewValue = TStateValue> implements AfterViewInit, OnInit {
  private isInitialized = false;
  private focusTrackingIsEnabled = false;

  @Input() set ngrxFormControlState(newState: FormControlState<NgrxFormControlValueType<TStateValue>>) {
    if (!newState) {
      throw new Error('The control state must not be undefined!');
    }

    const oldState = this.state;
    this.state = newState;

    if (this.isInitialized) {
      this.updateViewIfControlIdChanged(newState, oldState);
      this.updateViewIfValueChanged(newState, oldState);
      this.updateViewIfIsDisabledChanged(newState, oldState);
      this.updateViewIfIsFocusedChanged(newState, oldState);
    }
  }

  @Input() ngrxUpdateOn: NGRX_UPDATE_ON_TYPE = NGRX_UPDATE_ON_TYPE.CHANGE;
  @Input() set ngrxEnableFocusTracking(value: boolean) {
    if (value && !this.dom) {
      throw new Error('focus tracking is only supported on the browser platform');
    }

    this.focusTrackingIsEnabled = value;
  }

  @Input() ngrxValueConverter: NgrxValueConverter<TViewValue, TStateValue> = NgrxValueConverters.default<any>();

  // TODO: move this into a separate directive
  // automatically apply the attribute that's used by the CDK to set initial focus
  @HostBinding('attr.cdk-focus-region-start') get focusRegionStartAttr() {
    return this.state && this.state.isFocused ? '' : null;
  }

  state: FormControlState<NgrxFormControlValueType<TStateValue>>;

  private viewAdapter: FormViewAdapter;

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
    // for the dom parameter the `null` type must be last to ensure that in the compiled output
    // there is no reference to the Document type to support non-browser platforms
    @Optional() @Inject(DOCUMENT) private dom: Document | null,
    @Optional() @Inject(ActionsSubject) private actionsSubject: ActionsSubject | null,
    @Self() @Optional() @Inject(NGRX_FORM_VIEW_ADAPTER) viewAdapters: FormViewAdapter[],
    @Self() @Optional() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
  ) {
    viewAdapters = viewAdapters || [];
    valueAccessors = valueAccessors || [];

    if (valueAccessors.length > 1) {
      throw new Error('More than one custom control value accessor matches!');
    }

    this.viewAdapter = valueAccessors.length > 0
      ? new ControlValueAccessorAdapter(valueAccessors[0])
      : selectViewAdapter(viewAdapters);
  }

  updateViewIfControlIdChanged(
    newState: FormControlState<NgrxFormControlValueType<TStateValue>>,
    oldState: FormControlState<NgrxFormControlValueType<TStateValue>> | undefined,
  ) {
    if (oldState && newState.id === oldState.id) {
      return;
    }

    this.stateValue = newState.value;
    this.viewValue = this.ngrxValueConverter.convertStateToViewValue(this.stateValue);
    this.viewAdapter.setViewValue(this.viewValue);
    if (this.viewAdapter.setIsDisabled) {
      this.viewAdapter.setIsDisabled(newState.isDisabled);
    }
  }

  updateViewIfValueChanged(
    newState: FormControlState<NgrxFormControlValueType<TStateValue>>,
    _: FormControlState<NgrxFormControlValueType<TStateValue>> | undefined,
  ) {
    if (newState.value === this.stateValue) {
      return;
    }

    this.stateValue = newState.value;
    this.viewValue = this.ngrxValueConverter.convertStateToViewValue(newState.value);
    this.viewAdapter.setViewValue(this.viewValue);
  }

  updateViewIfIsDisabledChanged(
    newState: FormControlState<NgrxFormControlValueType<TStateValue>>,
    oldState: FormControlState<NgrxFormControlValueType<TStateValue>> | undefined,
  ) {
    if (!this.viewAdapter.setIsDisabled) {
      return;
    }

    if (oldState && newState.isDisabled === oldState.isDisabled) {
      return;
    }

    this.viewAdapter.setIsDisabled(newState.isDisabled);
  }

  updateViewIfIsFocusedChanged(
    newState: FormControlState<NgrxFormControlValueType<TStateValue>>,
    oldState: FormControlState<NgrxFormControlValueType<TStateValue>> | undefined,
  ) {
    if (!this.focusTrackingIsEnabled) {
      return;
    }

    if (oldState && newState.isFocused === oldState.isFocused) {
      return;
    }

    if (newState.isFocused) {
      this.el.nativeElement.focus();
    } else {
      this.el.nativeElement.blur();
    }
  }

  protected dispatchAction(action: Actions<NgrxFormControlValueType<TStateValue>>) {
    if (this.actionsSubject !== null) {
      this.actionsSubject.next(action);
    } else {
      throw new Error('ActionsSubject must be present in order to dispatch actions!');
    }
  }

  ngOnInit() {
    if (!this.state) {
      throw new Error('The form state must not be undefined!');
    }

    this.isInitialized = true;

    this.updateViewIfControlIdChanged(this.state, undefined);
    this.updateViewIfValueChanged(this.state, undefined);
    this.updateViewIfIsDisabledChanged(this.state, undefined);
    this.updateViewIfIsFocusedChanged(this.state, undefined);

    const dispatchMarkAsDirtyAction = () => {
      if (this.state.isPristine) {
        this.dispatchAction(new MarkAsDirtyAction(this.state.id));
      }
    };

    const dispatchSetValueAction = () => {
      this.stateValue = this.ngrxValueConverter.convertViewToStateValue(this.viewValue);
      if (this.stateValue !== this.state.value) {
        this.dispatchAction(new SetValueAction(this.state.id, this.stateValue as NgrxFormControlValueType<TStateValue>));

        dispatchMarkAsDirtyAction();
      }
    };

    this.viewAdapter.setOnChangeCallback((viewValue: TViewValue) => {
      this.viewValue = viewValue;

      if (this.ngrxUpdateOn === NGRX_UPDATE_ON_TYPE.CHANGE) {
        dispatchSetValueAction();
      }
    });

    this.viewAdapter.setOnTouchedCallback(() => {
      if (!this.state.isTouched && this.ngrxUpdateOn !== NGRX_UPDATE_ON_TYPE.NEVER) {
        this.dispatchAction(new MarkAsTouchedAction(this.state.id));
      }

      if (this.ngrxUpdateOn === NGRX_UPDATE_ON_TYPE.BLUR) {
        dispatchSetValueAction();
      }
    });
  }

  ngAfterViewInit() {
    // we need to update the view again after it was initialized since some
    // controls depend on child elements for setting the value (e.g. selects)
    this.viewAdapter.setViewValue(this.viewValue);
    if (this.viewAdapter.setIsDisabled) {
      this.viewAdapter.setIsDisabled(this.state.isDisabled);
    }
  }

  @HostListener('focusin')
  @HostListener('focusout')
  onFocusChange() {
    if (!this.focusTrackingIsEnabled) {
      return;
    }

    const isControlFocused = this.el.nativeElement === this.dom!.activeElement;
    if (isControlFocused !== this.state.isFocused) {
      this.dispatchAction(isControlFocused ? new FocusAction(this.state.id) : new UnfocusAction(this.state.id));
    }
  }
}
