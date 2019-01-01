import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { requiredTrue } from './required-true';

describe(requiredTrue.name, () => {
  it('should not return an error for null', () => {
    expect(requiredTrue(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(requiredTrue(undefined)).toEqual({});
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

  it('should not return an error for boxed true', () => {
    expect(requiredTrue(box(true))).toEqual({});
  });

  it('should return an error for boxed false', () => {
    const value = box(false);
    expect(requiredTrue(value)).toEqual({
      required: {
        actual: unbox(value),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<boolean> = undefined!;
      const v = validate(state, requiredTrue);
      const v2: boolean = v.value;
      console.log(v2);
    }
  });
});
