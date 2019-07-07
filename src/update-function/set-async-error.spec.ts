import { createFormArrayState, createFormGroupState } from '../state';
import { setAsyncError } from './set-async-error';
import { INITIAL_STATE } from './test-util';
import { updateGroup } from './update-group';

describe(setAsyncError.name, () => {
  const stateWithPendingValidations: typeof INITIAL_STATE = {
    ...INITIAL_STATE,
    pendingValidations: ['error'],
    controls: {
      ...INITIAL_STATE.controls,
      inner: {
        ...INITIAL_STATE.controls.inner,
        pendingValidations: ['error'],
      },
      inner5: {
        ...INITIAL_STATE.controls.inner5,
        pendingValidations: ['error'],
      },
    },
  };

  it('should call reducer for controls', () => {
    const resultState = setAsyncError('error', true)(stateWithPendingValidations.controls.inner);
    expect(resultState).not.toBe(stateWithPendingValidations.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = setAsyncError('error', true)(stateWithPendingValidations);
    expect(resultState).not.toBe(stateWithPendingValidations);
  });

  it('should call reducer for empty groups', () => {
    const state = {
      ...createFormGroupState('test ID', {}),
      pendingValidations: ['error'],
    };

    const resultState = setAsyncError('error', true)(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const resultState = setAsyncError('error', true)(stateWithPendingValidations.controls.inner5);
    expect(resultState).not.toBe(stateWithPendingValidations.controls.inner5);
  });

  it('should call reducer for empty arrays', () => {
    const state = {
      ...createFormArrayState('test ID', []),
      pendingValidations: ['error'],
    };

    const resultState = setAsyncError('error', true)(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for controls uncurried', () => {
    const resultState = setAsyncError(stateWithPendingValidations.controls.inner, 'error', true);
    expect(resultState).not.toBe(stateWithPendingValidations.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const resultState = setAsyncError(stateWithPendingValidations, 'error', true);
    expect(resultState).not.toBe(stateWithPendingValidations);
  });

  it('should call reducer for empty groups uncurried', () => {
    const state = {
      ...createFormGroupState('test ID', {}),
      pendingValidations: ['error'],
    };

    const resultState = setAsyncError(state, 'error', true);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = setAsyncError(stateWithPendingValidations.controls.inner5, 'error', true);
    expect(resultState).not.toBe(stateWithPendingValidations.controls.inner5);
  });

  it('should call reducer for empty arrays uncurried', () => {
    const state = {
      ...createFormArrayState('test ID', []),
      pendingValidations: ['error'],
    };

    const resultState = setAsyncError(state, 'error', true);
    expect(resultState).not.toBe(state);
  });

  it('should throw if curried and no state', () => {
    expect(() => setAsyncError('error', true)(undefined as any)).toThrowError();
  });

  it('should work inside an updateGroup', () => {
    const resultState = updateGroup(stateWithPendingValidations, {
      inner: setAsyncError('error', true),
    });

    expect(resultState).not.toEqual(stateWithPendingValidations);
  });

  it('should work inside an updateGroup uncurried', () => {
    const resultState = updateGroup<typeof stateWithPendingValidations.value>(stateWithPendingValidations, {
      inner: inner => setAsyncError(inner, 'error', true),
    });

    expect(resultState).not.toEqual(stateWithPendingValidations);
  });
});
