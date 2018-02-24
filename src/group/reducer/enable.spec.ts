import { EnableAction } from '../../actions';
import { cast } from '../../state';
import { enableReducer } from './enable';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  INITIAL_STATE_FULL,
  setPropertiesRecursively,
} from './test-util';

describe(`form group ${enableReducer.name}`, () => {
  it('should enable itself and all children recursively', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', true]]));
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL);
  });

  it('should not update state if all children are enabled recursively', () => {
    const resultState = enableReducer(INITIAL_STATE_FULL, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_FULL);
  });

  it('should enable children if the group itself is already enabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner2: {
          ...INITIAL_STATE_FULL.controls.inner2!,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL);
  });

  it('should enable without enabling any other children if control child gets enabled', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', true]]));
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls.inner2!.isEnabled).toBe(false);
    expect(resultState.controls.inner2!.isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if group child gets enabled', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', true]]));
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls.inner.isEnabled).toBe(false);
    expect(resultState.controls.inner.isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if array child gets enabled', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', true]]));
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls.inner.isEnabled).toBe(false);
    expect(resultState.controls.inner.isDisabled).toBe(true);
  });
});
