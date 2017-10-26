import { ValidationErrors } from 'ngrx-forms';

// tslint:disable-next-line:max-line-length
// this regex is taken from the @angular/forms source code
export const NGRX_FORMS_EMAIL_VALIDATION_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

/**
 * Validation function that requires a value to be a valid e-mail address.
 * Considers `null` and `''` as valid. Combine this function with the
 * `required` validation function if these values should be considered invalid.
 */
export function email(value: string | null): ValidationErrors {
  if (value === null || value.length === 0) {
    return {};
  }

  if (NGRX_FORMS_EMAIL_VALIDATION_REGEXP.test(value)) {
    return {};
  }

  return {
    email: {
      pattern: NGRX_FORMS_EMAIL_VALIDATION_REGEXP.toString(),
      actual: value,
    },
  };
}
