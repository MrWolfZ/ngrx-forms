import { markAsDirty } from './mark-as-dirty';
import { INITIAL_STATE } from './test-util';

describe(markAsDirty.name, () => {
  it('should call reducer for controls', () => {
    const resultState = markAsDirty(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = markAsDirty(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const resultState = markAsDirty(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });
});
