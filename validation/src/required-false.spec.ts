import { box, unbox } from 'ngrx-forms';
import { requiredFalse } from './required-false';

describe(requiredFalse.name, () => {
  it('should not return an error for null', () => {
    expect(requiredFalse(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(requiredFalse(undefined)).toEqual({});
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

  it('should return an error for boxed true', () => {
    const value = box(true);
    expect(requiredFalse(value)).toEqual({
      required: {
        actual: unbox(value),
      },
    });
  });

  it('should not return an error for boxed false', () => {
    expect(requiredFalse(box(false))).toEqual({});
  });
});
