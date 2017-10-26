import { requiredTrue } from './required-true';

describe(requiredTrue.name, () => {
  it('should not return an error for null', () => {
    expect(requiredTrue(null)).toEqual({});
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
