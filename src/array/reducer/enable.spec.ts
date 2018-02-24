import { EnableAction } from '../../actions';
import { enableReducer } from './enable';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_1_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${enableReducer.name}`, () => {
  it('should enable itself and all children recursively', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isEnabled', false], ['isDisabled', true]]);
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should not update state if all children are enabled recursively', () => {
    const resultState = enableReducer(INITIAL_STATE, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should enable children if the group itself is already enabled', () => {
    const state = {
      ...INITIAL_STATE,
      controls: [
        INITIAL_STATE.controls[0],
        {
          ...INITIAL_STATE.controls[1],
          isEnabled: false,
          isDisabled: true,
        },
      ],
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should enable if control child gets enabled', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isEnabled', false], ['isDisabled', true]], FORM_CONTROL_1_ID);
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should enable without enabling any other children if control child gets enabled', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isEnabled', false], ['isDisabled', true]]);
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if group child gets enabled', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_NESTED_GROUP, [['isEnabled', false], ['isDisabled', true]]);
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if array child gets enabled', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_NESTED_ARRAY, [['isEnabled', false], ['isDisabled', true]]);
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });
});
