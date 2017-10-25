import { ValidationErrors } from '../state';

// tslint:disable-next-line:max-line-length
// this regex is taken from the @angular/forms source code
export const NGRX_FORMS_EMAIL_VALIDATION_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

/**
 * Validation function that requires a value to be a valid e-mail address.
 */
export function email(value: string | null, treatNullAsError = true): ValidationErrors {
  if (value === null && treatNullAsError === false) {
    return {};
  }

  if (value !== null && NGRX_FORMS_EMAIL_VALIDATION_REGEXP.test(value)) {
    return {};
  }

  return {
    email: {
      pattern: NGRX_FORMS_EMAIL_VALIDATION_REGEXP.toString(),
      actual: value,
    },
  };
}
