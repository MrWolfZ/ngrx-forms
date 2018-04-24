import { greaterThanOrEqualTo } from './greater-than-or-equal-to';

describe(greaterThanOrEqualTo.name, () => {
  it('should throw for null comparand parameter', () => {
    expect(() => greaterThanOrEqualTo(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => greaterThanOrEqualTo(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(greaterThanOrEqualTo(1)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(greaterThanOrEqualTo(1)(undefined)).toEqual({});
  });

  it('should not return an error if value is greater than comparand', () => {
    expect(greaterThanOrEqualTo(1)(2)).toEqual({});
  });

  it('should not return an error if value is equal to comparand', () => {
    expect(greaterThanOrEqualTo(1)(1)).toEqual({});
  });

  it('should return an error if value is less than comparand', () => {
    expect(greaterThanOrEqualTo(1)(0)).not.toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 0;
    expect(greaterThanOrEqualTo(comparand)(actual)).toEqual({
      greaterThanOrEqualTo: {
        comparand,
        actual,
      },
    });
  });
});
