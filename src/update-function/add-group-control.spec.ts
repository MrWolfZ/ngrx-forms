import { addGroupControl } from './add-group-control';
import { FormGroupValue, INITIAL_STATE } from './test-util';

describe(addGroupControl.name, () => {
  it('should call reducer for groups', () => {
    const resultState = addGroupControl<FormGroupValue>('inner2', 'A')(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for groups uncurried', () => {
    const resultState = addGroupControl(INITIAL_STATE, 'inner2', 'A');
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should throw if curried and no state', () => {
    expect(() => addGroupControl<FormGroupValue>('inner2', 'A')(undefined as any)).toThrowError();
  });
});
