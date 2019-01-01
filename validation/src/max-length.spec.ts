import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { maxLength } from './max-length';

describe(maxLength.name, () => {
  it('should throw for null maxLength parameter', () => {
    expect(() => maxLength(null as any)).toThrow();
  });

  it('should throw for undefined maxLength parameter', () => {
    expect(() => maxLength(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(maxLength(2)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(maxLength(2)(undefined)).toEqual({});
  });

  it('should return an error if string value\'s length is greater than maxLength', () => {
    expect(maxLength(2)('abc')).not.toEqual({});
  });

  it('should not return an error if string value\'s length is equal to maxLength', () => {
    expect(maxLength(2)('ab')).toEqual({});
  });

  it('should not return an error if string value\'s length is less than maxLength', () => {
    expect(maxLength(2)('a')).toEqual({});
  });

  it('should return an error if array value\'s length is greater than maxLength', () => {
    expect(maxLength(2)(['a', 'b', 'c'])).not.toEqual({});
  });

  it('should not return an error if array value\'s length is equal to maxLength', () => {
    expect(maxLength(2)(['a', 'b'])).toEqual({});
  });

  it('should not return an error if array value\'s length is less than maxLength', () => {
    expect(maxLength(2)(['a'])).toEqual({});
  });

  it('should return errors with maxLength, value, and actualLength properties for string value', () => {
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

  it('should return errors with maxLength, value, and actualLength properties for array value', () => {
    const maxLengthParam = 2;
    const value = ['a', 'b', 'c'];
    expect(maxLength(maxLengthParam)(value)).toEqual({
      maxLength: {
        maxLength: maxLengthParam,
        value,
        actualLength: value.length,
      },
    });
  });

  it('should not return an error if boxed string value\'s length is equal to maxLength', () => {
    expect(maxLength(2)(box('ab'))).toEqual({});
  });

  it('should not return an error if boxed array value\'s length is equal to maxLength', () => {
    expect(maxLength(2)(box(['a', 'b']))).toEqual({});
  });

  it('should return errors with maxLength, value, and actualLength properties for boxed string value', () => {
    const maxLengthParam = 2;
    const value = box('abc');
    expect(maxLength(maxLengthParam)(value)).toEqual({
      maxLength: {
        maxLength: maxLengthParam,
        value: unbox(value),
        actualLength: unbox(value).length,
      },
    });
  });

  it('should return errors with maxLength, value, and actualLength properties for boxed array value', () => {
    const maxLengthParam = 2;
    const value = box(['a', 'b', 'c']);
    expect(maxLength(maxLengthParam)(value)).toEqual({
      maxLength: {
        maxLength: maxLengthParam,
        value: unbox(value),
        actualLength: unbox(value).length,
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<string> = undefined!;
      const v = validate(state, maxLength(2));
      const v2: string = v.value;
      console.log(v2);
    }
  });
});
