import { markAsPristine } from './mark-as-pristine';
import { INITIAL_STATE } from './test-util';

describe(markAsPristine.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isDirty: true, isPristine: false };
    const resultState = markAsPristine(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = markAsPristine(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isDirty: true, isPristine: false };
    const resultState = markAsPristine(state);
    expect(resultState).not.toBe(state);
  });
});
