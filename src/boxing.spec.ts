import { box, isBoxed, unbox } from './boxing';

describe(box.name, () => {
  it('should box a string value', () => {
    const value = 'A';
    expect(box(value).value).toBe(value);
  });
});

describe(unbox.name, () => {
  it('should unbox a string value', () => {
    const value = 'A';
    expect(unbox(value)).toBe(value);
  });

  it('should unbox a number value', () => {
    const value = 1;
    expect(unbox(value)).toBe(value);
  });

  it('should unbox a boolean value', () => {
    const value = true;
    expect(unbox(value)).toBe(value);
  });

  it('should unbox a undefined value', () => {
    const value = undefined;
    expect(unbox(value)).toBe(value);
  });

  it('should unbox a null value', () => {
    const value = null;
    expect(unbox(value)).toBe(value);
  });

  it('should unbox a boxed string value', () => {
    const value = 'A';
    expect(unbox(box(value))).toBe(value);
  });

  it('should unbox an array value', () => {
    const innerValue = 'A';
    const value = box([innerValue]);
    expect(unbox(value)).toEqual([innerValue]);
  });

  it('should unbox a value in an array', () => {
    const innerValue = 'A';
    const value = [box(innerValue)];
    expect(unbox(value)).toEqual([innerValue]);
  });

  it('should unbox an object value', () => {
    const innerValue = 'A';
    const value = box({ inner: innerValue });
    expect(unbox(value)).toEqual({ inner: innerValue });
  });

  it('should unbox a value in an object', () => {
    const innerValue = 'A';
    const value = { inner: box(innerValue) };
    expect(unbox(value)).toEqual({ inner: innerValue });
  });
});

describe(isBoxed.name, () => {
  it('should return true for a boxed value', () => {
    expect(isBoxed(box('A'))).toBe(true);
  });

  it('should return false for an unboxed string value', () => {
    expect(isBoxed('A')).toBe(false);
  });

  it('should return false for an undefined value', () => {
    expect(isBoxed(undefined)).toBe(false);
  });

  it('should return false for a null value', () => {
    expect(isBoxed(null)).toBe(false);
  });
});
