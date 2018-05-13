import { createFormArrayState } from '../state';
import { swapArrayControl } from './swap-array-control';
import { FORM_CONTROL_ID } from './test-util';

describe('swapArrayControl', () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, [ 0, 1, 2, 3 ]);

  it('should call reducer for arrays', () => {
    const resultState = swapArrayControl<number>(1, 2)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
    expect(resultState.value).toEqual([ 0, 2, 1, 3 ]);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = swapArrayControl<number>(3, 1, INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
    expect(resultState.value).toEqual([ 0, 3, 2, 1 ]);
  });

  it('should throw if curried and no state', () => {
    expect(() => swapArrayControl<number>(0, 1)(undefined as any)).toThrowError();
  });
});
