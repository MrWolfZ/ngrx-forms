import { max } from './max';

describe('max', () => {
  it('should throw for null maxValue parameter', () => {
    expect(() => max(null as any)).toThrow();
  });

  it('should throw for undefined maxValue parameter', () => {
    expect(() => max(undefined as any)).toThrow();
  });

  it('should return an error for null if treatNullAsError is true', () => {
    expect(max(1, true)(null)).not.toEqual({});
  });

  it('should not return an error for null if treatNullAsError is false', () => {
    expect(max(1, false)(null)).toEqual({});
  });

  it('should return an error if value is greater than maxValue', () => {
    expect(max(1)(2)).not.toEqual({});
  });

  it('should not return an error if value is equal to maxValue', () => {
    expect(max(1)(1)).toEqual({});
  });

  it('should not return an error if value is less than maxValue', () => {
    expect(max(1)(0)).toEqual({});
  });

  it('should return errors with max and actual properties', () => {
    const maxValue = 1;
    const actualValue = 2;
    expect(max(maxValue)(actualValue)).toEqual({
      max: {
        max: maxValue,
        actual: actualValue,
      },
    });
  });
});
