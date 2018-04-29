import { createFormArrayState } from '../state';
import { removeArrayControl } from './remove-array-control';
import { FORM_CONTROL_ID } from './test-util';

describe(removeArrayControl.name, () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, ['']);

  it('should call reducer for arrays', () => {
    const resultState = removeArrayControl(0)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = removeArrayControl(INITIAL_ARRAY_STATE, 0);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should throw if curried and no state', () => {
    expect(() => removeArrayControl(0)(undefined as any)).toThrowError();
  });
});
