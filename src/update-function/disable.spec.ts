import { cast } from '../state';
import { disable } from './disable';
import { INITIAL_STATE } from './test-util';

describe(disable.name, () => {
  it('should call reducer for controls', () => {
    const resultState = disable(cast(INITIAL_STATE.controls.inner));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const resultState = disable(INITIAL_STATE);
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const resultState = disable(cast(INITIAL_STATE.controls.inner5));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });
});
