import { markAsUntouched } from './mark-as-untouched';
import { INITIAL_STATE } from './test-util';

describe(markAsUntouched.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isTouched: true, isUntouched: false };
    const resultState = markAsUntouched(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
    const resultState = markAsUntouched(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isTouched: true, isUntouched: false };
    const resultState = markAsUntouched(state);
    expect(resultState).not.toBe(state);
  });
});
