import { minLength } from './minLength';

describe('minLength', () => {
  it('should throw for null minLength parameter', () => {
    expect(() => minLength(null as any)).toThrow();
  });

  it('should throw for undefined minLength parameter', () => {
    expect(() => minLength(undefined as any)).toThrow();
  });

  it('should return an error for null if treatNullAsError is true', () => {
    expect(minLength(2, true)(null)).not.toEqual({});
  });

  it('should return an error for null if treatNullAsError is true and minLength is 0', () => {
    expect(minLength(0, true)(null)).not.toEqual({});
  });

  it('should not return an error for null if treatNullAsError is false', () => {
    expect(minLength(2, false)(null)).toEqual({});
  });

  it('should not return an error if value\'s length is greater than minLength', () => {
    expect(minLength(2)('abc')).toEqual({});
  });

  it('should not return an error if value\'s length is equal to minLength', () => {
    expect(minLength(2)('ab')).toEqual({});
  });

  it('should return an error if value\'s length is less than minLength', () => {
    expect(minLength(2)('a')).not.toEqual({});
  });

  it('should return errors with minLength, value and actualLength properties', () => {
    const minLengthValue = 2;
    const value = 'a';
    expect(minLength(minLengthValue)(value)).toEqual({
      minLength: {
        minLength: minLengthValue,
        value,
        actualLength: value.length,
      },
    });
  });
});
