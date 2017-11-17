import { markAsTouched } from './mark-as-touched';
import { INITIAL_STATE } from './test-util';

describe(markAsTouched.name, () => {
  it('should call reducer for controls', () => {
    const resultState = markAsTouched(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = markAsTouched(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const resultState = markAsTouched(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });
});
