import { cast } from '../state';
import { setUserDefinedProperty } from './set-user-defined-property';
import { INITIAL_STATE } from './test-util';

describe(setUserDefinedProperty.name, () => {
  it('should call reducer for controls', () => {
    const resultState = setUserDefinedProperty('prop', 12)(cast(INITIAL_STATE.controls.inner));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
  });

  it('should call reducer for groups', () => {
    const resultState = setUserDefinedProperty('prop', 12)(cast(INITIAL_STATE));
    expect(resultState).not.toBe(cast(INITIAL_STATE));
  });

  it('should call reducer for arrays', () => {
    const resultState = setUserDefinedProperty('prop', 12)(cast(INITIAL_STATE.controls.inner5));
    expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
  });
});
