import { requiredTrue } from './requiredTrue';

describe('requiredTrue', () => {
  it('should return an error for null if treatNullAsError is true', () => {
    const value = null;
    expect(requiredTrue(value, true)).toEqual({
      required: {
        actual: value,
      },
    });
  });

  it('should not return an error for null if treatNullAsError is false', () => {
    expect(requiredTrue(null, false)).toEqual({});
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
});
