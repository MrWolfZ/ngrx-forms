import { requiredFalse } from './required-false';

describe('requiredFalse', () => {
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
