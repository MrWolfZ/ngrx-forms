import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { email, NGRX_FORMS_EMAIL_VALIDATION_REGEXP } from './email';

// note that we do not test the validation regex itself, but we
// assume that it has been tested by the angular team and is correct
describe(email.name, () => {
  it('should not return an error for null', () => {
    expect(email(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(email(undefined)).toEqual({});
  });

  it('should not return an error for empty string', () => {
    expect(email('')).toEqual({});
  });

  it('should not return an error if value is valid mail address with top-level domain', () => {
    expect(email('a@b.com')).toEqual({});
  });

  it('should not return an error if value is valid mail address without top-level domain', () => {
    expect(email('a@b')).toEqual({});
  });

  it('should return an error if value is not a valid mail address', () => {
    expect(email('abc')).not.toEqual({});
  });

  it('should return errors with pattern and actual properties', () => {
    const value = 'abc';
    expect(email(value)).toEqual({
      email: {
        pattern: NGRX_FORMS_EMAIL_VALIDATION_REGEXP.toString(),
        actual: value,
      },
    });
  });

  it('should not return an error if value is boxed valid mail address', () => {
    expect(email(box('a@b.com'))).toEqual({});
  });

  it('should return errors with pattern and actual properties for boxed values', () => {
    const value = box('abc');
    expect(email(value)).toEqual({
      email: {
        pattern: NGRX_FORMS_EMAIL_VALIDATION_REGEXP.toString(),
        actual: unbox(value),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<string> = undefined!;
      const v = validate(state, email);
      const v2: string = v.value;
      console.log(v2);
    }
  });
});
