import { email } from './email';
import { max } from './max';
import { maxLength } from './maxLength';
import { min } from './min';
import { minLength } from './minLength';
import { pattern } from './pattern';
import { required } from './required';
import { requiredFalse } from './requiredFalse';
import { requiredTrue } from './requiredTrue';

// optimally, we should export the functions directly from the sub-modules
// and make them accessible to the user through an import from the validation
// submodule, e.g. import { required } from 'ngrx-forms/validation', however,
// I have not yet figured out how to do that. Therefore, we export the object
// below which unfortunately forces us to put the documentation on the properties
// of the object as well

// Note that all the parameter sanity checks in the validation functions
// are only required for users that use the library without strict null
// checking turned on
export const NgrxValidation = {
  /**
   * Validation function that requires the value to be non-empty.
   */
  required,

  /**
   * Validation function that requires the value to be true.
   */
  requiredTrue,

  /**
   * Validation function that requires the value to be false.
   */
  requiredFalse,

  /**
   * Validation function that requires the value to be greater than or equal to a number.
   */
  min,

  /**
   * Validation function that requires the value to be less than or equal to a number.
   */
  max,

  /**
   * Validation function that performs email validation.
   */
  email,

  /**
   * Validation function that requires a value to have a minimum length.
   */
  minLength,

  /**
   * Validation function that requires a value to have a maximum length.
   */
  maxLength,

  /**
   * Validation function that requires a control to match a regex to its value.
   */
  pattern,
};
