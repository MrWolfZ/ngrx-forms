import { box, unbox } from 'ngrx-forms';
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
});
