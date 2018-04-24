import { lessThan } from './less-than';

describe(lessThan.name, () => {
  it('should throw for null comparand parameter', () => {
    expect(() => lessThan(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => lessThan(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(lessThan(1)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(lessThan(1)(undefined)).toEqual({});
  });

  it('should return an error if value is greater than comparand', () => {
    expect(lessThan(1)(2)).not.toEqual({});
  });

  it('should return an error if value is equal to comparand', () => {
    expect(lessThan(1)(1)).not.toEqual({});
  });

  it('should not return an error if value is less than comparand', () => {
    expect(lessThan(1)(0)).toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 2;
    expect(lessThan(comparand)(actual)).toEqual({
      lessThan: {
        comparand,
        actual,
      },
    });
  });
});
