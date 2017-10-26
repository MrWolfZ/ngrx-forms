import { required } from './required';

describe(required.name, () => {
  it('should return an error for null', () => {
    const value = null;
    expect(required(value)).toEqual({
      required: {
        actual: value,
      },
    });
  });

  it('should return an error for empty string', () => {
    const value = '';
    expect(required(value)).toEqual({
      required: {
        actual: value,
      },
    });
  });

  it('should not return an error for number zero', () => {
    expect(required(0)).toEqual({});
  });

  it('should not return an error for number', () => {
    expect(required(415)).toEqual({});
  });

  it('should not return an error for non-empty string', () => {
    expect(required('a')).toEqual({});
  });

  it('should not return an error for true', () => {
    expect(required(true)).toEqual({});
  });

  it('should not return an error for false', () => {
    expect(required(false)).toEqual({});
  });
});
