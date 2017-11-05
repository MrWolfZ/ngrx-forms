import { cast } from '../state';
import { FormGroupValue, INITIAL_STATE } from './test-util';
import { setErrors } from './set-errors';

describe(setErrors.name, () => {
  it('should call reducer for controls', () => {
    const errors = { required: true };
    const resultState = setErrors<string>(errors)(cast(INITIAL_STATE.controls.inner));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const errors = { required: true };
    const resultState = setErrors<FormGroupValue>(errors)(INITIAL_STATE);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const errors = { required: true };
    const resultState = setErrors<string[]>(errors)(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });

  it('should call reducer for controls uncurried', () => {
    const errors = { required: true };
    const resultState = setErrors(errors, INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const errors = { required: true };
    const resultState = setErrors(errors, INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const errors = { required: true };
    const resultState = setErrors(errors, INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should merge errors from multiple validation functions', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors<string>([errors1, errors2])(cast(INITIAL_STATE.controls.inner));
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions in the order they were provided', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = setErrors<string>([errors1, errors2])(cast(INITIAL_STATE.controls.inner));
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should throw if curried and no state', () => {
    const errors = { required: true };
    expect(() => setErrors<string>(errors)(undefined as any)).toThrowError();
  });
});
