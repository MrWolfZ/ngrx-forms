import { AbstractControlState, box, validate } from 'ngrx-forms';
import { noSequentialCharacters } from './no-sequential-characters';

describe(noSequentialCharacters.name, () => {
  it('should not return an error if value does not contain sequential characters in requisite length', () => {
    expect(noSequentialCharacters(3)('password')).toEqual({});
    expect(noSequentialCharacters(4)('abc')).toEqual({});
    expect(noSequentialCharacters(5)('Thank you for MrWolfZ')).toEqual({});
  });

  it('should not return an error if a boxed value does not contain sequential characters in requisite length', () => {
    expect(noSequentialCharacters(3)(box('password'))).toEqual({});
    expect(noSequentialCharacters(4)(box('abc'))).toEqual({});
    expect(noSequentialCharacters(5)(box('Thank you for MrWolfZ'))).toEqual({});
  });

  it('should not return an error if value is null', () => {
    expect(noSequentialCharacters(3)(null)).toEqual({});
  });

  it('should not return an error if value is undefined', () => {
    expect(noSequentialCharacters(3)(undefined)).toEqual({});
  });

  it('should not return an error if sequence contains "z" in position not last', () => {
    expect(noSequentialCharacters(3)('yz{')).toEqual({});
  });

  it('should not return an error if sequence contains "Z" in position not last', () => {
    expect(noSequentialCharacters(3)('YZ[')).toEqual({});
  });

  it('should not return an error if sequence contains "0" in position not last', () => {
    expect(noSequentialCharacters(3)('89:')).toEqual({});
  });

  it('should throw for null maxLength parameter', () => {
    expect(() => noSequentialCharacters(null as any)).toThrow();
  });

  it('should return an error with value and detected sequence if one is found', () => {
    expect(noSequentialCharacters(4)('1234password')).toEqual({
      noSequentialCharacters: {
        value: '1234password',
        detectedSequence: '1234',
      }
    });
    expect(noSequentialCharacters(3)('superstar')).toEqual({
      noSequentialCharacters: {
        value: 'superstar',
        detectedSequence: 'rst',
      }
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<string> = undefined!;
      const v = validate(state, noSequentialCharacters(3));
      const v2: string = v.value;
      console.log(v2);
    }
  });
});
