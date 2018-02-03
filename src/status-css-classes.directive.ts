import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControlState } from './state';

/**
 * Lists the available status class names based on the property
 * they are depending on.
 */
export const NGRX_STATUS_CLASS_NAMES = {
  isValid: 'ngrx-forms-valid',
  isInvalid: 'ngrx-forms-invalid',
  isDirty: 'ngrx-forms-dirty',
  isPristine: 'ngrx-forms-pristine',
  isTouched: 'ngrx-forms-touched',
  isUntouched: 'ngrx-forms-untouched',
  isSubmitted: 'ngrx-forms-submitted',
  isUnsubmitted: 'ngrx-forms-unsubmitted',
  isValidationPending: 'ngrx-forms-validation-pending',
};

@Directive({
  selector: 'form[ngrxFormState],[ngrxFormControlState]',
})
export class NgrxStatusCssClassesDirective {
  private state: AbstractControlState<any>;

  @Input()
  set ngrxFormControlState(state: AbstractControlState<any>) {
    this.state = state;
  }

  @Input()
  set ngrxFormState(state: AbstractControlState<any>) {
    this.state = state;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isValid}`)
  get isValid() {
    return this.state.isValid;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isInvalid}`)
  get isInvalid() {
    return this.state.isInvalid;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isDirty}`)
  get isDirty() {
    return this.state.isDirty;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isPristine}`)
  get isPristine() {
    return this.state.isPristine;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isTouched}`)
  get isTouched() {
    return this.state.isTouched;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isUntouched}`)
  get isUntouched() {
    return this.state.isUntouched;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isSubmitted}`)
  get isSubmitted() {
    return this.state.isSubmitted;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isUnsubmitted}`)
  get isUnsubmitted() {
    return this.state.isUnsubmitted;
  }

  @HostBinding(`class.${NGRX_STATUS_CLASS_NAMES.isValidationPending}`)
  get isValidationPending() {
    return this.state.isValidationPending;
  }
}
