import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { pattern } from './pattern';

describe(pattern.name, () => {
  it('should throw for null pattern parameter', () => {
    expect(() => pattern(null as any)).toThrow();
  });

  it('should throw for undefined pattern parameter', () => {
    expect(() => pattern(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(pattern(/a/g)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(pattern(/a/g)(undefined)).toEqual({});
  });

  it('should not return an error for empty string', () => {
    expect(pattern(/a/g)('')).toEqual({});
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

  it('should not return an error if boxed value matches pattern', () => {
    expect(pattern(/a/g)(box('a'))).toEqual({});
  });

  it('should return errors with pattern and actual properties for boxed value', () => {
    const patternValue = /a/g;
    const actualValue = box('b');
    expect(pattern(patternValue)(actualValue)).toEqual({
      pattern: {
        pattern: patternValue.toString(),
        actual: unbox(actualValue),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<string> = undefined!;
      const v = validate(state, pattern(/a/g));
      const v2: string = v.value;
      console.log(v2);
    }
  });
});
