import { createFormArrayState } from '../state';
import { moveArrayControl } from './move-array-control';
import { FORM_CONTROL_ID } from './test-util';

describe('moveArrayControl', () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, [ 0, 1, 2, 3 ]);

  it('should call reducer for arrays', () => {
    const resultState = moveArrayControl(1, 0)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
    expect(resultState.value).toEqual([ 1, 0, 2, 3 ]);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = moveArrayControl(INITIAL_ARRAY_STATE, 0, 2);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
    expect(resultState.value).toEqual([ 1, 2, 0, 3 ]);
  });

  it('should throw if curried and no state', () => {
    expect(() => moveArrayControl(0, 1)(undefined as any)).toThrowError();
  });
});
