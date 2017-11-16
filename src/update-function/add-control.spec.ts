import { cast, createFormArrayState } from '../state';
import { addControl } from './add-control';
import { FORM_CONTROL_ID, FormGroupValue, INITIAL_STATE } from './test-util';

describe(addControl.name, () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, ['']);

  it('should call reducer for groups', () => {
    const resultState = addControl<FormGroupValue, 'inner2'>('inner2', 'A')(INITIAL_STATE);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const resultState = addControl('A', 1)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(cast(INITIAL_ARRAY_STATE));
  });
});
