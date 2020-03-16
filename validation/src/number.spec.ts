import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { number } from './number';

describe(number.name, () => {
  it('should not return an error for null', () => {
    expect(number(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(number(undefined)).toEqual({});
  });

  it('should not return an error for any number', () => {
    expect(number(-123.45)).toEqual({});
    expect(number(-123)).toEqual({});
    expect(number(0)).toEqual({});
    expect(number(123)).toEqual({});
    expect(number(123.45)).toEqual({});
  });

  it('should not return an error for any boxed number', () => {
    expect(number(box(123))).toEqual({});
  });

  it('should return an error if value is not a number', () => {
    expect(number('abc' as any)).not.toEqual({});
    expect(number(false as any)).not.toEqual({});
    expect(number([] as any)).not.toEqual({});
  });

  it('should return an unboxed error if value is not a number', () => {
    expect(number(box('abc' as any))).not.toEqual({});
  });

  it('should return error with actual property', () => {
    const actual = 'abc' as any;
    expect(number(actual)).toEqual({
      number: {
        actual,
      },
    });
  });

  it('should return error with actual property for boxed value', () => {
    const actual = box('abc' as any);
    expect(number(actual)).toEqual({
      number: {
        actual: unbox(actual),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<number> = undefined!;
      const v = validate(state, number);
      const v2: number = v.value;
      console.log(v2);
    }
  });
});
