import { InjectionToken } from '@angular/core';

export interface FormViewAdapter {
  /**
   * Sets a new value for the form element.
   */
  setViewValue(value: any): void;

  /**
   * Set the function to be called when the form element receives a change event.
   */
  setOnChangeCallback(fn: (value: any) => void): void;

  /**
   * Set the function to be called when the form element receives a touch event.
   */
  setOnTouchedCallback(fn: () => void): void;

  /**
   * Enable or disable the form element.
   */
  setIsDisabled?(isDisabled: boolean): void;
}

/**
 * Used to provide a {@link FormViewAdapter} for form elements.
 */
export const NGRX_FORM_VIEW_ADAPTER = new InjectionToken<FormViewAdapter>('NgrxFormViewAdapter');
