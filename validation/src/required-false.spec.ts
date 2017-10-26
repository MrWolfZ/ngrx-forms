import { requiredFalse } from './required-false';

describe('requiredFalse', () => {
  it('should not return an error for null', () => {
    expect(requiredFalse(null)).toEqual({});
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
