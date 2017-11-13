import { DisableAction } from '../../actions';
import { cast } from '../../state';
import { disableReducer } from './disable';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  INITIAL_STATE,
  INITIAL_STATE_FULL,
  setPropertiesRecursively,
} from './test-util';

describe(`form group ${disableReducer.name}`, () => {
  it('should update state if enabled', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.isEnabled).toEqual(false);
    expect(resultState.isDisabled).toEqual(true);
  });

  it('should not update state if disabled', () => {
    const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_ID));
    expect(resultState).toBe(state);
  });

  it('should mark the state as valid and clear all errors', () => {
    const errors = { required: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.isValid).toEqual(true);
    expect(resultState.isInvalid).toEqual(false);
    expect(resultState.errors).toEqual({});
  });

  it('should clear all pending validations', () => {
    const state = { ...INITIAL_STATE, pendingValidations: ['required'], isValidationPending: true };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toBe(false);
  });

  it('should disable control children', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isEnabled).toBe(false);
    expect(resultState.controls.inner.isDisabled).toBe(true);
  });

  it('should disable group children', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isEnabled).toBe(false);
    expect(resultState.controls.inner3.isDisabled).toBe(true);
  });

  it('should disable array children', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isEnabled).toBe(false);
    expect(resultState.controls.inner5.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when control child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should disable if all children are disabled when group child is disabled', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', false]], FORM_CONTROL_INNER3_ID));
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when array child is disabled', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', false]], FORM_CONTROL_INNER5_ID));
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });
});
