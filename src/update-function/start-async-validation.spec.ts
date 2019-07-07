import { createFormArrayState, createFormGroupState } from '../state';
import { startAsyncValidation } from './start-async-validation';
import { INITIAL_STATE } from './test-util';
import { updateGroup } from './update-group';

describe(startAsyncValidation.name, () => {
  it('should call reducer for controls', () => {
    const resultState = startAsyncValidation('error')(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = startAsyncValidation('error')(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for empty groups', () => {
    const state = createFormGroupState('test ID', {});
    const resultState = startAsyncValidation('error')(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const resultState = startAsyncValidation('error')(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for empty arrays', () => {
    const state = createFormArrayState('test ID', []);
    const resultState = startAsyncValidation('error')(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for controls uncurried', () => {
    const resultState = startAsyncValidation(INITIAL_STATE.controls.inner, 'error');
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const resultState = startAsyncValidation(INITIAL_STATE, 'error');
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for empty groups uncurried', () => {
    const state = createFormGroupState('test ID', {});
    const resultState = startAsyncValidation(state, 'error');
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = startAsyncValidation(INITIAL_STATE.controls.inner5, 'error');
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for empty arrays uncurried', () => {
    const state = createFormArrayState<string>('test ID', []);
    const resultState = startAsyncValidation(state, 'error');
    expect(resultState).not.toBe(state);
  });

  it('should throw if curried and no state', () => {
    expect(() => startAsyncValidation('error')(undefined as any)).toThrowError();
  });

  it('should work inside an updateGroup', () => {
    const resultState = updateGroup(INITIAL_STATE, {
      inner: startAsyncValidation('error'),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });

  it('should work inside an updateGroup uncurried', () => {
    const resultState = updateGroup<typeof INITIAL_STATE.value>(INITIAL_STATE, {
      inner: inner => startAsyncValidation(inner, 'error'),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });
});
