import { cast } from '../state';
import { removeControl } from './remove-control';
import { FormGroupValue, INITIAL_STATE } from './test-util';

describe(removeControl.name, () => {
  it('should call reducer for groups', () => {
    const resultState = removeControl<FormGroupValue>('inner3')(INITIAL_STATE);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });
});
