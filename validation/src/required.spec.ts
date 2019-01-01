import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { required } from './required';

describe(required.name, () => {
  it('should return an error for undefined', () => {
    const value = undefined;
    expect(required(value)).toEqual({
      required: {
        actual: value,
      },
    });
  });

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

  it('should return an error for empty array', () => {
    const value: any[] = [];
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

  it('should not return an error for non-empty array', () => {
    expect(required(['a'])).toEqual({});
  });

  it('should work for boxed strings', () => {
    expect(required(box('a'))).toEqual({});
  });

  it('should return an error for boxed undefined', () => {
    const value = box(undefined);
    expect(required(value)).toEqual({
      required: {
        actual: unbox(value),
      },
    });
  });

  it('should return an error for boxed null', () => {
    const value = box(null);
    expect(required(value)).toEqual({
      required: {
        actual: unbox(value),
      },
    });
  });

  it('should return an error for boxed empty string', () => {
    const value = box('');
    expect(required(value)).toEqual({
      required: {
        actual: unbox(value),
      },
    });
  });

  it('should return an error for boxed empty array', () => {
    const value = box([] as any[]);
    expect(required(value)).toEqual({
      required: {
        actual: unbox(value),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<number> = undefined!;
      const v = validate(state, required);
      const v2: number = v.value;
      console.log(v2);
    }
  });
});
