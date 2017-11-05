import { cast } from '../state';
import { markAsPristine } from './mark-as-pristine';
import { INITIAL_STATE } from './test-util';

describe(markAsPristine.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isDirty: false, isPristine: true };
    const resultState = markAsPristine(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const state = { ...INITIAL_STATE, isDirty: false, isPristine: true };
    const resultState = markAsPristine(state);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isDirty: false, isPristine: true };
    const resultState = markAsPristine(cast(state));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });
});
