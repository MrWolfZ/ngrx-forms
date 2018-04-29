import { setUserDefinedProperty } from './set-user-defined-property';
import { INITIAL_STATE } from './test-util';
import { updateGroup } from './update-group';

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
    const resultState = setUserDefinedProperty(INITIAL_STATE.controls.inner, 'prop', 12);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const resultState = setUserDefinedProperty(INITIAL_STATE, 'prop', 12);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const resultState = setUserDefinedProperty(INITIAL_STATE.controls.inner5, 'prop', 12);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should throw if curried and no state', () => {
    expect(() => setUserDefinedProperty('prop', 12)(undefined as any)).toThrowError();
  });

  it('should work inside an updateGroup', () => {
    const resultState = updateGroup(INITIAL_STATE, {
      inner: setUserDefinedProperty('prop', 12),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });

  it('should work inside an updateGroup uncurried', () => {
    const resultState = updateGroup<typeof INITIAL_STATE.value>(INITIAL_STATE, {
      inner: inner => setUserDefinedProperty(inner, 'prop', 12),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });
});
