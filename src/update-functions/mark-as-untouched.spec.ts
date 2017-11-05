import { cast } from '../state';
import { markAsUntouched } from './mark-as-untouched';
import { INITIAL_STATE } from './test-util';

describe(markAsUntouched.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isTouched: false, isUntouched: true };
    const resultState = markAsUntouched(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isTouched: false, isUntouched: true };
    const resultState = markAsUntouched(state);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isTouched: false, isUntouched: true };
    const resultState = markAsUntouched(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });
});
