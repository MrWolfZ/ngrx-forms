import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { greaterThan } from './greater-than';

describe(greaterThan.name, () => {
  it('should throw for null comparand parameter', () => {
    expect(() => greaterThan(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => greaterThan(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(greaterThan(1)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(greaterThan(1)(undefined)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(greaterThan(1)('' as any)).toEqual({});
  });

  it('should not return an error for non-numeric value', () => {
    expect(greaterThan(1)('string' as any)).toEqual({});
  });

  it('should not return an error if value is greater than comparand', () => {
    expect(greaterThan(1)(2)).toEqual({});
  });

  it('should return an error if value is equal to comparand', () => {
    expect(greaterThan(1)(1)).not.toEqual({});
  });

  it('should return an error if value is less than comparand', () => {
    expect(greaterThan(1)(0)).not.toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 0;
    expect(greaterThan(comparand)(actual)).toEqual({
      greaterThan: {
        comparand,
        actual,
      },
    });
  });

  it('should not return an error if boxed value is greater than comparand', () => {
    expect(greaterThan(1)(box(2))).toEqual({});
  });

  it('should return errors with comparand and actual properties for boxed value', () => {
    const comparand = 1;
    const actual = box(0);
    expect(greaterThan(comparand)(actual)).toEqual({
      greaterThan: {
        comparand,
        actual: unbox(actual),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<number> = undefined!;
      const v = validate(state, greaterThan(0));
      const v2: number = v.value;
      console.log(v2);
    }
  });
});
