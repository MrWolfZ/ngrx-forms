import { maxLength } from './max-length';

describe(maxLength.name, () => {
  it('should throw for null maxLength parameter', () => {
    expect(() => maxLength(null as any)).toThrow();
  });

  it('should throw for undefined maxLength parameter', () => {
    expect(() => maxLength(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(maxLength(2)(null)).toEqual({});
  });

  it('should return an error if string value\'s length is greater than maxLength', () => {
    expect(maxLength(2)('abc')).not.toEqual({});
  });

  it('should not return an error if string value\'s length is equal to maxLength', () => {
    expect(maxLength(2)('ab')).toEqual({});
  });

  it('should not return an error if string value\'s length is less than maxLength', () => {
    expect(maxLength(2)('a')).toEqual({});
  });

  it('should return an error if array value\'s length is greater than maxLength', () => {
    expect(maxLength(2)(['a', 'b', 'c'])).not.toEqual({});
  });

  it('should not return an error if array value\'s length is equal to maxLength', () => {
    expect(maxLength(2)(['a', 'b'])).toEqual({});
  });

  it('should not return an error if array value\'s length is less than maxLength', () => {
    expect(maxLength(2)(['a'])).toEqual({});
  });

  it('should return errors with maxLength, value, and actualLength properties', () => {
    const maxLengthParam = 2;
    const value = 'abc';
    expect(maxLength(maxLengthParam)(value)).toEqual({
      maxLength: {
        maxLength: maxLengthParam,
        value,
        actualLength: value.length,
      },
    });
  });
});
