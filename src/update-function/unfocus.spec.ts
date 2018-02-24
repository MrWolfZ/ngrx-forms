import { INITIAL_STATE } from './test-util';
import { unfocus } from './unfocus';

describe(unfocus.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isFocused: true, isUnfocused: false };
    const resultState = unfocus(state);
    expect(resultState).not.toBe(state);
  });
});
