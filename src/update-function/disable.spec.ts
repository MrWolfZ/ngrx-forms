import { disable } from './disable';
import { INITIAL_STATE } from './test-util';

describe(disable.name, () => {
  it('should call reducer for controls', () => {
    const resultState = disable(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = disable(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const resultState = disable(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });
});
