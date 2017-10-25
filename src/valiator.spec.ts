import { NgrxValidators, NGRX_FORMS_EMAIL_VALIDATION_REGEXP } from './validator';

describe('NgrxValidators', () => {
  describe('required', () => {
    const required = NgrxValidators.required;

    it('should return an error for null', () => {
      const value = null;
      expect(required(value)).toEqual({
        required: {
          actual: value,
        },
      });
    });

    it('should return an error for empty string', () => {
      const value = '';
      expect(required(value)).toEqual({
        required: {
          actual: value,
        },
      });
    });

    it('should not return an error for number zero', () => {
      expect(required(0)).toEqual({});
    });

    it('should not return an error for number', () => {
      expect(required(415)).toEqual({});
    });

    it('should not return an error for non-empty string', () => {
      expect(required('a')).toEqual({});
    });

    it('should not return an error for true', () => {
      expect(required(true)).toEqual({});
    });

    it('should not return an error for false', () => {
      expect(required(false)).toEqual({});
    });
  });

  describe('requiredTrue', () => {
    const requiredTrue = NgrxValidators.requiredTrue;

    it('should return an error for null if treatNullAsError is true', () => {
      const value = null;
      expect(requiredTrue(value, true)).toEqual({
        required: {
          actual: value,
        },
      });
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(requiredTrue(null, false)).toEqual({});
    });

    it('should not return an error for true', () => {
      expect(requiredTrue(true)).toEqual({});
    });

    it('should return an error for false', () => {
      const value = false;
      expect(requiredTrue(value)).toEqual({
        required: {
          actual: value,
        },
      });
    });
  });

  describe('requiredFalse', () => {
    const requiredFalse = NgrxValidators.requiredFalse;

    it('should return an error for null if treatNullAsError is true', () => {
      const value = null;
      expect(requiredFalse(value, true)).toEqual({
        required: {
          actual: value,
        },
      });
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(requiredFalse(null, false)).toEqual({});
    });

    it('should return an error for true', () => {
      const value = true;
      expect(requiredFalse(value)).toEqual({
        required: {
          actual: value,
        },
      });
    });

    it('should not return an error for false', () => {
      expect(requiredFalse(false)).toEqual({});
    });
  });

  describe('min', () => {
    const min = NgrxValidators.min;

    it('should throw for null minValue parameter', () => {
      expect(() => min(null as any)).toThrow();
    });

    it('should throw for undefined minValue parameter', () => {
      expect(() => min(undefined as any)).toThrow();
    });

    it('should return an error for null if treatNullAsError is true', () => {
      expect(min(1, true)(null)).not.toEqual({});
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(min(1, false)(null)).toEqual({});
    });

    it('should not return an error if value is greater than minValue', () => {
      expect(min(1)(2)).toEqual({});
    });

    it('should not return an error if value is equal to minValue', () => {
      expect(min(1)(1)).toEqual({});
    });

    it('should return an error if value is less than minValue', () => {
      expect(min(1)(0)).not.toEqual({});
    });

    it('should return errors with min and actual properties', () => {
      const minValue = 1;
      const actualValue = 0;
      expect(min(minValue)(actualValue)).toEqual({
        min: {
          min: minValue,
          actual: actualValue,
        },
      });
    });
  });

  describe('max', () => {
    const max = NgrxValidators.max;

    it('should throw for null maxValue parameter', () => {
      expect(() => max(null as any)).toThrow();
    });

    it('should throw for undefined maxValue parameter', () => {
      expect(() => max(undefined as any)).toThrow();
    });

    it('should return an error for null if treatNullAsError is true', () => {
      expect(max(1, true)(null)).not.toEqual({});
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(max(1, false)(null)).toEqual({});
    });

    it('should return an error if value is greater than maxValue', () => {
      expect(max(1)(2)).not.toEqual({});
    });

    it('should not return an error if value is equal to maxValue', () => {
      expect(max(1)(1)).toEqual({});
    });

    it('should not return an error if value is less than maxValue', () => {
      expect(max(1)(0)).toEqual({});
    });

    it('should return errors with max and actual properties', () => {
      const maxValue = 1;
      const actualValue = 2;
      expect(max(maxValue)(actualValue)).toEqual({
        max: {
          max: maxValue,
          actual: actualValue,
        },
      });
    });
  });

  // note that we do not test the validation regex itself, but we
  // assume that it has been tested by the angular team and is correct
  describe('email', () => {
    const email = NgrxValidators.email;

    it('should return an error for null if treatNullAsError is true', () => {
      expect(email(null, true)).not.toEqual({});
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(email(null, false)).toEqual({});
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

    it('should return an error if value is empty string', () => {
      expect(email('')).not.toEqual({});
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
  });

  describe('minLength', () => {
    const minLength = NgrxValidators.minLength;

    it('should throw for null minLength parameter', () => {
      expect(() => minLength(null as any)).toThrow();
    });

    it('should throw for undefined minLength parameter', () => {
      expect(() => minLength(undefined as any)).toThrow();
    });

    it('should return an error for null if treatNullAsError is true', () => {
      expect(minLength(2, true)(null)).not.toEqual({});
    });

    it('should return an error for null if treatNullAsError is true and minLength is 0', () => {
      expect(minLength(0, true)(null)).not.toEqual({});
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(minLength(2, false)(null)).toEqual({});
    });

    it('should not return an error if value\'s length is greater than minLength', () => {
      expect(minLength(2)('abc')).toEqual({});
    });

    it('should not return an error if value\'s length is equal to minLength', () => {
      expect(minLength(2)('ab')).toEqual({});
    });

    it('should return an error if value\'s length is less than minLength', () => {
      expect(minLength(2)('a')).not.toEqual({});
    });

    it('should return errors with minLength, value and actualLength properties', () => {
      const minLengthValue = 2;
      const value = 'a';
      expect(minLength(minLengthValue)(value)).toEqual({
        minLength: {
          minLength: minLengthValue,
          value,
          actualLength: value.length,
        },
      });
    });
  });

  describe('maxLength', () => {
    const maxLength = NgrxValidators.maxLength;

    it('should throw for null maxLength parameter', () => {
      expect(() => maxLength(null as any)).toThrow();
    });

    it('should throw for undefined maxLength parameter', () => {
      expect(() => maxLength(undefined as any)).toThrow();
    });

    it('should return an error for null if treatNullAsError is true', () => {
      expect(maxLength(2, true)(null)).not.toEqual({});
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(maxLength(2, false)(null)).toEqual({});
    });

    it('should return an error if value\'s length is greater than maxLength', () => {
      expect(maxLength(2)('abc')).not.toEqual({});
    });

    it('should not return an error if value\'s length is equal to maxLength', () => {
      expect(maxLength(2)('ab')).toEqual({});
    });

    it('should not return an error if value\'s length is less than maxLength', () => {
      expect(maxLength(2)('a')).toEqual({});
    });

    it('should return errors with maxLength, value, and actualLength properties', () => {
      const maxLengthParam = 2;
      const value = 'abc';
      expect(maxLength(maxLengthParam)(value)).toEqual({
        maxLength: {
          maxLength: maxLengthParam,
          value,
          actualLength: value.length,
        },
      });
    });
  });

  describe('pattern', () => {
    const pattern = NgrxValidators.pattern;

    it('should throw for null pattern parameter', () => {
      expect(() => pattern(null as any)).toThrow();
    });

    it('should throw for undefined pattern parameter', () => {
      expect(() => pattern(undefined as any)).toThrow();
    });

    it('should return an error for null if treatNullAsError is true', () => {
      expect(pattern(/a/g, true)(null)).not.toEqual({});
    });

    it('should not return an error for null if treatNullAsError is false', () => {
      expect(pattern(/a/g, false)(null)).toEqual({});
    });

    it('should not return an error if value matches pattern', () => {
      expect(pattern(/a/g)('a')).toEqual({});
    });

    it('should return an error if value does not match pattern', () => {
      expect(pattern(/a/g)('b')).not.toEqual({});
    });

    it('should return errors with pattern and actual properties', () => {
      const patternValue = /a/g;
      const actualValue = 'b';
      expect(pattern(patternValue)(actualValue)).toEqual({
        pattern: {
          pattern: patternValue.toString(),
          actual: actualValue,
        },
      });
    });
  });
});
