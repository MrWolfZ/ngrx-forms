import { cast, createFormArrayState } from '../state';
import { removeControl } from './remove-control';
import { FORM_CONTROL_ID, FormGroupValue, INITIAL_STATE } from './test-util';

describe(removeControl.name, () => {
  const INITIAL_ARRAY_STATE = createFormArrayState(FORM_CONTROL_ID, ['']);

  it('should call reducer for groups', () => {
    const resultState = removeControl<FormGroupValue>('inner3')(INITIAL_STATE);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const resultState = removeControl<string>(0)(INITIAL_ARRAY_STATE);
    expect(resultState).not.toBe(cast(INITIAL_ARRAY_STATE));
  });
});
