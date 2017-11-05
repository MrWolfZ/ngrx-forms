import { cast } from '../state';
import { markAsUnsubmitted } from './mark-as-unsubmitted';
import { INITIAL_STATE } from './test-util';

describe(markAsUnsubmitted.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isSubmitted: false, isUnsubmitted: true };
    const resultState = markAsUnsubmitted(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isSubmitted: false, isUnsubmitted: true };
    const resultState = markAsUnsubmitted(state);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isSubmitted: false, isUnsubmitted: true };
    const resultState = markAsUnsubmitted(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });
});
