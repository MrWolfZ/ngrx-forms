import { createFormArrayState } from '../state';
import { removeArrayControl } from './remove-array-control';
import { FORM_CONTROL_ID } from './test-util';

describe(removeArrayControl.name, () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, ['']);

  it('should call reducer for arrays', () => {
    const resultState = removeArrayControl<string>(0)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = removeArrayControl<string>(0, INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should throw if curried and no state', () => {
    expect(() => removeArrayControl<string>(0)(undefined as any)).toThrowError();
  });
});
