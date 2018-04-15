import { createFormArrayState } from '../state';
import { addArrayControl } from './add-array-control';
import { FORM_CONTROL_ID } from './test-util';

describe(addArrayControl.name, () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, ['']);

  it('should call reducer for arrays', () => {
    const resultState = addArrayControl('A', 1)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should call reducer for arrays without index', () => {
    const resultState = addArrayControl('A')(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = addArrayControl(INITIAL_ARRAY_STATE, 'A', 1);
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should call reducer for arrays uncurried without index', () => {
    const resultState = addArrayControl(INITIAL_ARRAY_STATE, 'A');
    expect(resultState).not.toBe(INITIAL_ARRAY_STATE);
  });

  it('should throw if curried and no state', () => {
    expect(() => addArrayControl('A', 1)(undefined as any)).toThrowError();
  });
});
