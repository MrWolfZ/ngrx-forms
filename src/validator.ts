import { ValidationErrors } from './state';

export type ValidationFn<TValue> = (value: TValue) => ValidationErrors;

// tslint:disable-next-line:max-line-length
// this regex is taken from the @angular/forms source code
export const NGRX_FORMS_EMAIL_VALIDATION_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

// Note that all the parameter sanity checks below are only required for users
// that use the library without strict null checking turned on
export const NgrxValidators = {
  /**
   * validator that requires the value to be non-empty.
   */
  required: <T>(value: T | null): ValidationErrors => {
    if (value !== null && (value as any).length !== 0) {
      return {};
    }

    return {
      required: {
        actual: value,
      },
    };
  },

  /**
   * validator that requires the value to be true.
   */
  requiredTrue: (value: boolean | null, treatNullAsError = true): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value === true) {
      return {};
    }

    return {
      required: {
        actual: value,
      },
    };
  },

  /**
   * validator that requires the value to be false.
   */
  requiredFalse: (value: boolean | null, treatNullAsError = true): ValidationErrors => {
    if (value === null && treatNullAsError === false) {
      return {};
    }

    if (value === false) {
      return {};
    }

    return {
      required: {
        actual: value,
      },
    };
  },

  /**
   * validator that requires the value to be greater than or equal to a number.
   */
  min(minValue: number, treatNullAsError = true): ValidationFn<number | null> {
    if (minValue === null || minValue === undefined) {
      throw new Error(`The min validator requires the minValue parameter to be a non-null number, got ${minValue}!`);
    }

    return (value: number | null): ValidationErrors => {
      if (value === null && treatNullAsError === false) {
        return {};
      }

      if (value !== null && value >= minValue) {
        return {};
      }

      return {
        min: {
          min: minValue,
          actual: value,
        },
      };
    };
  },

  /**
   * validator that requires the value to be less than or equal to a number.
   */
  max(maxValue: number, treatNullAsError = true): ValidationFn<number | null> {
    if (maxValue === null || maxValue === undefined) {
      throw new Error(`The max validator requires the maxValue parameter to be a non-null number, got ${maxValue}!`);
    }

    return (value: number | null): ValidationErrors => {
      if (value === null && treatNullAsError === false) {
        return {};
      }

      if (value !== null && value <= maxValue) {
        return {};
      }

      return {
        max: {
          max: maxValue,
          actual: value,
        },
      };
    };
  },

  /**
   * validator that performs email validation.
   */
  email(value: string | null, treatNullAsError = true): ValidationErrors {
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
  },

  /**
   * validator that requires a value to have a minimum length.
   */
  minLength(minLength: number, treatNullAsError = true): ValidationFn<string | null> {
    if (minLength === null || minLength === undefined) {
      throw new Error(`The minLength validator requires the minLength parameter to be a non-null number, got ${minLength}!`);
    }

    return (value: string | null): ValidationErrors => {
      if (value === null && treatNullAsError === false) {
        return {};
      }

      const length = (value || '').length;

      if (value !== null && length >= minLength) {
        return {};
      }

      return {
        minLength: {
          minLength,
          value,
          actualLength: length,
        },
      };
    };
  },

  /**
   * validator that requires a value to have a maximum length.
   */
  maxLength(maxLength: number, treatNullAsError = true): ValidationFn<string | null> {
    if (maxLength === null || maxLength === undefined) {
      throw new Error(`The maxLength validator requires the maxLength parameter to be a non-null number, got ${maxLength}!`);
    }

    return (value: string | null): ValidationErrors => {
      if (value === null && treatNullAsError === false) {
        return {};
      }

      const length = (value || '').length;

      if (value !== null && length <= maxLength) {
        return {};
      }

      return {
        maxLength: {
          maxLength,
          value,
          actualLength: length,
        },
      };
    };
  },

  /**
   * validator that requires a control to match a regex to its value.
   */
  pattern(pattern: RegExp, treatNullAsError = true): ValidationFn<string | null> {
    if (pattern === null || pattern === undefined) {
      throw new Error(`The pattern validator requires the pattern parameter to be a non-null string or regular expression, got ${pattern}!`);
    }

    return (value: string | null): ValidationErrors => {
      if (value === null && treatNullAsError === false) {
        return {};
      }

      if (value !== null && pattern.test(value)) {
        return {};
      }

      return {
        pattern: {
          pattern: pattern.toString(),
          actual: value,
        },
      };
    };
  },
};
