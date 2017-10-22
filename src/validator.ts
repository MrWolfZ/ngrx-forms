import { ValidationErrors } from './state';

export type ValidationFn<TValue> = (value: TValue) => ValidationErrors;

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

// Note that all the parameter sanity checks below are only required for users
// that use the library without strict null checking turned on
export const NgrxValidators = {
  /**
   * Validator that requires the value to be non-empty.
   */
  required: <T>(value: T): ValidationErrors => {
    return isEmptyInputValue(value) ? { required: true } : {};
  },
  /**
   * Validator that requires the value to be greater than a number.
   */
  min(minValue: number) {
    if (minValue === null || minValue === undefined) {
      throw new Error(`The min validator requires the minValue parameter to be a non-null number, got ${minValue}!`);
    }

    return (value: number | null): ValidationErrors => {
      if (value === null || minValue === undefined) {
        return {};
      }

      return value < minValue ? { min: { min: minValue, actual: value } } : {};
    };
  },
};
