import { minLength } from './min-length';

describe(minLength.name, () => {
  it('should throw for null minLength parameter', () => {
    expect(() => minLength(null as any)).toThrow();
  });

  it('should throw for undefined minLength parameter', () => {
    expect(() => minLength(undefined as any)).toThrow();
  });

  it('should not return an error for null', () => {
    expect(minLength(2)(null)).toEqual({});
  });

  it('should not return an error for undefined', () => {
    expect(minLength(2)(undefined)).toEqual({});
  });

  it('should not return an error if string value\'s length is greater than minLength', () => {
    expect(minLength(2)('abc')).toEqual({});
  });

  it('should not return an error if string value\'s length is equal to minLength', () => {
    expect(minLength(2)('ab')).toEqual({});
  });

  it('should return an error if string value\'s length is less than minLength', () => {
    expect(minLength(2)('a')).not.toEqual({});
  });

  it('should not return an error if array value\'s length is greater than minLength', () => {
    expect(minLength(2)(['a', 'b', 'c'])).toEqual({});
  });

  it('should not return an error if array value\'s length is equal to minLength', () => {
    expect(minLength(2)(['a', 'b'])).toEqual({});
  });

  it('should return an error if array value\'s length is less than minLength', () => {
    expect(minLength(2)(['a'])).not.toEqual({});
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
