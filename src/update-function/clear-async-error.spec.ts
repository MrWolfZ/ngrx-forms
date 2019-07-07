import { createFormArrayState, createFormGroupState } from '../state';
import { clearAsyncError } from './clear-async-error';
import { INITIAL_STATE } from './test-util';
import { updateGroup } from './update-group';

describe(clearAsyncError.name, () => {
  const stateWithAsyncError: typeof INITIAL_STATE = {
    ...INITIAL_STATE,
    errors: {
      $error: true,
      _inner: { $error: true },
      _inner5: { $error: true },
    },
    isValid: false,
    isInvalid: true,
    controls: {
      ...INITIAL_STATE.controls,
      inner: {
        ...INITIAL_STATE.controls.inner,
        errors: { $error: true },
        isValid: false,
        isInvalid: true,
      },
      inner5: {
        ...INITIAL_STATE.controls.inner5,
        errors: { $error: true },
        isValid: false,
        isInvalid: true,
      },
    },
  };

  it('should call reducer for controls', () => {
    const resultState = clearAsyncError('error')(stateWithAsyncError.controls.inner);
    expect(resultState).not.toBe(stateWithAsyncError.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = clearAsyncError('error')(stateWithAsyncError);
    expect(resultState).not.toBe(stateWithAsyncError);
  });

  it('should call reducer for empty groups', () => {
    const state = {
      ...createFormGroupState('test ID', {}),
      errors: { $error: true },
    };

    const resultState = clearAsyncError('error')(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const resultState = clearAsyncError('error')(stateWithAsyncError.controls.inner5);
    expect(resultState).not.toBe(stateWithAsyncError.controls.inner5);
  });

  it('should call reducer for empty arrays', () => {
    const state = {
      ...createFormArrayState('test ID', []),
      errors: { $error: true },
    };

    const resultState = clearAsyncError('error')(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for controls uncurried', () => {
    const resultState = clearAsyncError(stateWithAsyncError.controls.inner, 'error');
    expect(resultState).not.toBe(stateWithAsyncError.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const resultState = clearAsyncError(stateWithAsyncError, 'error');
    expect(resultState).not.toBe(stateWithAsyncError);
  });

  it('should call reducer for empty groups uncurried', () => {
    const state = {
      ...createFormGroupState('test ID', {}),
      errors: { $error: true },
    };

    const resultState = clearAsyncError(state, 'error');
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = clearAsyncError(stateWithAsyncError.controls.inner5, 'error');
    expect(resultState).not.toBe(stateWithAsyncError.controls.inner5);
  });

  it('should call reducer for empty arrays uncurried', () => {
    const state = {
      ...createFormArrayState('test ID', []),
      errors: { $error: true },
    };

    const resultState = clearAsyncError(state, 'error');
    expect(resultState).not.toBe(state);
  });

  it('should throw if curried and no state', () => {
    expect(() => clearAsyncError('error')(undefined as any)).toThrowError();
  });

  it('should work inside an updateGroup', () => {
    const resultState = updateGroup(stateWithAsyncError, {
      inner: clearAsyncError('error'),
    });

    expect(resultState).not.toEqual(stateWithAsyncError);
  });

  it('should work inside an updateGroup uncurried', () => {
    const resultState = updateGroup<typeof stateWithAsyncError.value>(stateWithAsyncError, {
      inner: inner => clearAsyncError(inner, 'error'),
    });

    expect(resultState).not.toEqual(stateWithAsyncError);
  });
});
