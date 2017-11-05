import { cast } from '../state';
import { INITIAL_STATE } from './test-util';
import { unfocus } from './unfocus';

describe(unfocus.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isSubmitted: false, isUnsubmitted: true };
    const resultState = unfocus(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });
});
