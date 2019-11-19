import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { minLength } from './min-length';

describe(minLength.name, () => {
  it('should throw for null minLength parameter', () => {
    expect(() => minLength(null as any)).toThrow();
  });

  it('should throw for undefined minLength parameter', () => {
    expect(() => minLength(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(minLength(2)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(minLength(2)(undefined)).toEqual({});
  });

  it('should not return an error for an empty string', () => {
    expect(minLength(2)('')).toEqual({});
  });

  it('should not return an error for an empty array', () => {
    expect(minLength(2)([])).toEqual({});
  });

  it('should not return an error if string value\'s length is greater than minLength', () => {
    expect(minLength(2)('abc')).toEqual({});
  });

  it('should not return an error if string value\'s length is equal to minLength', () => {
    expect(minLength(2)('ab')).toEqual({});
  });

  it('should return an error if string value\'s length is less than minLength', () => {
    expect(minLength(2)('a')).not.toEqual({});
  });

  it('should not return an error if array value\'s length is greater than minLength', () => {
    expect(minLength(2)(['a', 'b', 'c'])).toEqual({});
  });

  it('should not return an error if array value\'s length is equal to minLength', () => {
    expect(minLength(2)(['a', 'b'])).toEqual({});
  });

  it('should return an error if array value\'s length is less than minLength', () => {
    expect(minLength(2)(['a'])).not.toEqual({});
  });

  it('should return errors with minLength, value and actualLength properties for string value', () => {
    const minLengthParam = 2;
    const value = 'a';
    expect(minLength(minLengthParam)(value)).toEqual({
      minLength: {
        minLength: minLengthParam,
        value,
        actualLength: value.length,
      },
    });
  });

  it('should return errors with minLength, value and actualLength properties for array value', () => {
    const minLengthParam = 2;
    const value = ['a'];
    expect(minLength(minLengthParam)(value)).toEqual({
      minLength: {
        minLength: minLengthParam,
        value,
        actualLength: value.length,
      },
    });
  });

  it('should not return an error if boxed string value\'s length is equal to minLength', () => {
    expect(minLength(2)(box('ab'))).toEqual({});
  });

  it('should not return an error if boxed array value\'s length is equal to minLength', () => {
    expect(minLength(2)(box(['a', 'b']))).toEqual({});
  });

  it('should return errors with minLength, value, and actualLength properties for boxed string value', () => {
    const minLengthParam = 2;
    const value = box('a');
    expect(minLength(minLengthParam)(value)).toEqual({
      minLength: {
        minLength: minLengthParam,
        value: unbox(value),
        actualLength: unbox(value).length,
      },
    });
  });

  it('should return errors with minLength, value, and actualLength properties for boxed array value', () => {
    const minLengthParam = 2;
    const value = box(['a']);
    expect(minLength(minLengthParam)(value)).toEqual({
      minLength: {
        minLength: minLengthParam,
        value: unbox(value),
        actualLength: unbox(value).length,
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<string> = undefined!;
      const v = validate(state, minLength(2));
      const v2: string = v.value;
      console.log(v2);
    }
  });
});
