import { cast } from '../state';
import { enable } from './enable';
import { INITIAL_STATE } from './test-util';

describe(enable.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isEnabled: false, isDisabled: true };
    const resultState = enable(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
    const resultState = enable(state);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isEnabled: false, isDisabled: true };
    const resultState = enable(state);
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });
});
