import { lessThanOrEqualTo } from './less-than-or-equal-to';

describe('lessThanOrEqualTo', () => {
  it('should throw for null comparand parameter', () => {
    expect(() => lessThanOrEqualTo(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => lessThanOrEqualTo(undefined as any)).toThrow();
  });

  it('should return an error for null if treatNullAsError is true', () => {
    expect(lessThanOrEqualTo(1, true)(null)).not.toEqual({});
  });

  it('should not return an error for null if treatNullAsError is false', () => {
    expect(lessThanOrEqualTo(1, false)(null)).toEqual({});
  });

  it('should return an error if value is greater than comparand', () => {
    expect(lessThanOrEqualTo(1)(2)).not.toEqual({});
  });

  it('should not return an error if value is equal to comparand', () => {
    expect(lessThanOrEqualTo(1)(1)).toEqual({});
  });

  it('should not return an error if value is less than comparand', () => {
    expect(lessThanOrEqualTo(1)(0)).toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 2;
    expect(lessThanOrEqualTo(comparand)(actual)).toEqual({
      lessThanOrEqualTo: {
        comparand,
        actual,
      },
    });
  });
});
