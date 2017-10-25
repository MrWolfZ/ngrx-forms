import { greaterThan } from './greaterThan';

describe('greaterThan', () => {
  it('should throw for null comparand parameter', () => {
    expect(() => greaterThan(null as any)).toThrow();
  });

  it('should throw for undefined comparand parameter', () => {
    expect(() => greaterThan(undefined as any)).toThrow();
  });

  it('should return an error for null if treatNullAsError is true', () => {
    expect(greaterThan(1, true)(null)).not.toEqual({});
  });

  it('should not return an error for null if treatNullAsError is false', () => {
    expect(greaterThan(1, false)(null)).toEqual({});
  });

  it('should not return an error if value is greater than comparand', () => {
    expect(greaterThan(1)(2)).toEqual({});
  });

  it('should return an error if value is equal to comparand', () => {
    expect(greaterThan(1)(1)).not.toEqual({});
  });

  it('should return an error if value is less than comparand', () => {
    expect(greaterThan(1)(0)).not.toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actual = 0;
    expect(greaterThan(comparand)(actual)).toEqual({
      greaterThan: {
        comparand,
        actual,
      },
    });
  });
});
