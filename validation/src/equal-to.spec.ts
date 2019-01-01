import { AbstractControlState, box, unbox, validate } from 'ngrx-forms';
import { equalTo } from './equal-to';

describe(equalTo.name, () => {
  it('should not return an error if value is equal to comparand', () => {
    expect(equalTo(1)(1)).toEqual({});
  });

  it('should return an error if value is not equal to comparand', () => {
    expect(equalTo(1)(0)).not.toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actualValue = 0;
    expect(equalTo(comparand)(actualValue)).toEqual({
      equalTo: {
        comparand,
        actual: actualValue,
      },
    });
  });

  it('should not return an error if boxed value is equal to comparand', () => {
    expect(equalTo(1)(box(1))).toEqual({});
  });

  it('should return errors with comparand and actual properties for boxed value', () => {
    const comparand = 1;
    const actualValue = box(0);
    expect(equalTo(comparand)(actualValue)).toEqual({
      equalTo: {
        comparand,
        actual: unbox(actualValue),
      },
    });
  });

  it('should properly infer value type when used with validate update function', () => {
    // this code is never meant to be executed, it should just pass the type checker
    if (1 !== 1) {
      const state: AbstractControlState<string> = undefined!;
      const v = validate(state, equalTo('a'));
      const v2: string = v.value;
      console.log(v2);
    }
  });
});
