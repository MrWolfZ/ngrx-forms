import { FormGroupValue, INITIAL_STATE } from './test-util';
import { validate } from './validate';

describe(validate.name, () => {
  it('should call reducer for controls', () => {
    const errors = { required: true };
    const resultState = validate<string>(() => errors)(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const errors = { required: true };
    const resultState = validate<FormGroupValue>(() => errors)(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const errors = { required: true };
    const resultState = validate<string[]>(() => errors)(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for controls uncurried', () => {
    const errors = { required: true };
    const resultState = validate(() => errors, INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const errors = { required: true };
    const resultState = validate(() => errors, INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const errors = { required: true };
    const resultState = validate(() => errors, INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should merge errors from multiple validation functions', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = validate<string>([() => errors1, () => errors2])(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions in the order they were provided', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate<string>([() => errors1, () => errors2])(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should throw if curried and no state', () => {
    const errors = { required: true };
    expect(() => validate<string>(() => errors)(undefined as any)).toThrowError();
  });
});
