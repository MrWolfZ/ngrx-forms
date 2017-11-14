import { cast } from '../state';
import { addControl } from './add-control';
import { FormGroupValue, INITIAL_STATE } from './test-util';

describe(addControl.name, () => {
  it('should call reducer for groups', () => {
    const resultState = addControl<FormGroupValue, 'inner2'>('inner2', 'A')(INITIAL_STATE);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });
});
