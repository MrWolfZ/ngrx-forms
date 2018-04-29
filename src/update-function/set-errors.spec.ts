import { createFormArrayState, createFormGroupState } from '../state';
import { setErrors } from './set-errors';
import { INITIAL_STATE } from './test-util';
import { updateGroup } from './update-group';

describe(setErrors.name, () => {
  it('should call reducer for controls', () => {
    const errors = { required: true };
    const resultState = setErrors(errors)(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const errors = { required: true };
    const resultState = setErrors(errors)(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for empty groups', () => {
    const errors = { required: true };
    const state = createFormGroupState('test ID', {});
    const resultState = setErrors(errors)(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const errors = { required: true };
    const resultState = setErrors(errors)(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for empty arrays', () => {
    const errors = { required: true };
    const state = createFormArrayState('test ID', []);
    const resultState = setErrors(errors)(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for controls uncurried', () => {
    const errors = { required: true };
    const resultState = setErrors(INITIAL_STATE.controls.inner, errors);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const errors = { required: true };
    const resultState = setErrors(INITIAL_STATE, errors);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for empty groups uncurried', () => {
    const errors = { required: true };
    const state = createFormGroupState('test ID', {});
    const resultState = setErrors(state, errors);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays uncurried', () => {
    const errors = { required: true };
    const resultState = setErrors(INITIAL_STATE.controls.inner5, errors);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for empty arrays uncurried', () => {
    const errors = { required: true };
    const state = createFormArrayState<string>('test ID', []);
    const resultState = setErrors(state, errors);
    expect(resultState).not.toBe(state);
  });

  it('should merge single errors with rest param errors', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors(errors1, errors2)(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge single errors with rest param array errors', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors(errors1, [errors2])(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from array of errors', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors([errors1, errors2])(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from array of errors in the order they were provided', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = setErrors([errors1, errors2])(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge single errors with rest param errors uncurried', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors(INITIAL_STATE.controls.inner, errors1, errors2);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge single errors with rest param array errors uncurried', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors(INITIAL_STATE.controls.inner, errors1, [errors2]);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from array of errors uncurried', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = setErrors(INITIAL_STATE.controls.inner, [errors1, errors2]);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should throw if curried and no state', () => {
    const errors = { required: true };
    expect(() => setErrors(errors)(undefined as any)).toThrowError();
  });

  it('should work inside an updateGroup', () => {
    const errors = { required: true };
    const resultState = updateGroup(INITIAL_STATE, {
      inner: setErrors(errors),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });

  it('should work inside an updateGroup uncurried', () => {
    const errors = { required: true };
    const resultState = updateGroup<typeof INITIAL_STATE.value>(INITIAL_STATE, {
      inner: inner => setErrors(inner, errors),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });
});
