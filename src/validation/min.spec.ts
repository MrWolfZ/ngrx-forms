import { min } from './min';

describe('min', () => {
  it('should throw for null minValue parameter', () => {
    expect(() => min(null as any)).toThrow();
  });

  it('should throw for undefined minValue parameter', () => {
    expect(() => min(undefined as any)).toThrow();
  });

  it('should return an error for null if treatNullAsError is true', () => {
    expect(min(1, true)(null)).not.toEqual({});
  });

  it('should not return an error for null if treatNullAsError is false', () => {
    expect(min(1, false)(null)).toEqual({});
  });

  it('should not return an error if value is greater than minValue', () => {
    expect(min(1)(2)).toEqual({});
  });

  it('should not return an error if value is equal to minValue', () => {
    expect(min(1)(1)).toEqual({});
  });

  it('should return an error if value is less than minValue', () => {
    expect(min(1)(0)).not.toEqual({});
  });

  it('should return errors with min and actual properties', () => {
    const minValue = 1;
    const actualValue = 0;
    expect(min(minValue)(actualValue)).toEqual({
      min: {
        min: minValue,
        actual: actualValue,
      },
    });
  });
});
