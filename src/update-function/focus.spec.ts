import { focus } from './focus';
import { INITIAL_STATE } from './test-util';

describe(focus.name, () => {
  it('should call reducer for controls', () => {
    const resultState = focus(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });
});
