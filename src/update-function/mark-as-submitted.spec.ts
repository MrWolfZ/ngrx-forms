import { markAsSubmitted } from './mark-as-submitted';
import { INITIAL_STATE } from './test-util';

describe(markAsSubmitted.name, () => {
  it('should call reducer for controls', () => {
    const resultState = markAsSubmitted(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = markAsSubmitted(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const resultState = markAsSubmitted(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });
});
