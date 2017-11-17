import { markAsUnsubmitted } from './mark-as-unsubmitted';
import { INITIAL_STATE } from './test-util';

describe(markAsUnsubmitted.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isSubmitted: true, isUnsubmitted: false };
    const resultState = markAsUnsubmitted(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    const resultState = markAsUnsubmitted(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isSubmitted: true, isUnsubmitted: false };
    const resultState = markAsUnsubmitted(state);
    expect(resultState).not.toBe(state);
  });
});
