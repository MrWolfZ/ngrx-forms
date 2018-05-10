import { DisableAction } from '../../actions';
import { disableReducer } from './disable';
import {
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
} from './test-util';

describe(`form array ${disableReducer.name}`, () => {
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
    expect(resultState.controls[0].isEnabled).toBe(false);
    expect(resultState.controls[0].isDisabled).toBe(true);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });

  it('should disable group children', () => {
    const resultState = disableReducer(INITIAL_STATE_NESTED_GROUP, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isEnabled).toBe(false);
    expect(resultState.controls[0].isDisabled).toBe(true);
  });

  it('should disable array children', () => {
    const resultState = disableReducer(INITIAL_STATE_NESTED_ARRAY, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isEnabled).toBe(false);
    expect(resultState.controls[0].isDisabled).toBe(true);
  });

  it('should forward actions to children', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(INITIAL_STATE.controls[0].id));
    expect(resultState).not.toBe(INITIAL_STATE);
  });
});
