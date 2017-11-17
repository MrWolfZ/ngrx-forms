import { setUserDefinedProperty } from './set-user-defined-property';
import { INITIAL_STATE } from './test-util';

describe(setUserDefinedProperty.name, () => {
  it('should call reducer for controls', () => {
    const resultState = setUserDefinedProperty('prop', 12)(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const resultState = setUserDefinedProperty('prop', 12)(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const resultState = setUserDefinedProperty('prop', 12)(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for controls uncurried', () => {
    const resultState = setUserDefinedProperty('prop', 12, INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const resultState = setUserDefinedProperty('prop', 12, INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = setUserDefinedProperty('prop', 12, INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should throw if curried and no state', () => {
    expect(() => setUserDefinedProperty('prop', 12)(undefined as any)).toThrowError();
  });
});
