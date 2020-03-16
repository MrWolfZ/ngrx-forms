import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { lessThan } from './less-than';

describe(lessThan.name, () => {
  it('should throw for null comparand parameter', () => {
    expect(() => lessThan(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => lessThan(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(lessThan(1)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(lessThan(1)(undefined)).toEqual({});
  });

  it('should not return an error for non-numeric value', () => {
    expect(lessThan(1)('string' as any)).toEqual({});
  });

  it('should return an error if value is greater than comparand', () => {
    expect(lessThan(1)(2)).not.toEqual({});
  });

  it('should return an error if value is equal to comparand', () => {
    expect(lessThan(1)(1)).not.toEqual({});
  });

  it('should not return an error if value is less than comparand', () => {
    expect(lessThan(1)(0)).toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 2;
    expect(lessThan(comparand)(actual)).toEqual({
      lessThan: {
        comparand,
        actual,
      },
    });
  });

  it('should not return an error if boxed value is less than comparand', () => {
    expect(lessThan(1)(box(0))).toEqual({});
  });

  it('should return errors with comparand and actual properties for boxed value', () => {
    const comparand = 1;
    const actual = box(2);
    expect(lessThan(comparand)(actual)).toEqual({
      lessThan: {
        comparand,
        actual: unbox(actual),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<number> = undefined!;
      const v = validate(state, lessThan(2));
      const v2: number = v.value;
      console.log(v2);
    }
  });
});
