import { DisableAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { disableReducer } from './disable';

describe('form group disableReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_0_ID = FORM_CONTROL_ID + '.0';
  const FORM_CONTROL_1_ID = FORM_CONTROL_ID + '.1';
  const INITIAL_FORM_ARRAY_VALUE = ['', ''];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: '' }];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [['']];
  const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
  const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
  const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);

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

  it('should disable if all children are disabled when control child is disabled', () => {
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
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when direct control child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should disable if all children are disabled when direct group child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_NESTED_GROUP, new DisableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when direct array child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_NESTED_ARRAY, new DisableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should forward actions to children', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_0_ID));
    expect(resultState.controls[0].isEnabled).toEqual(false);
    expect(resultState.controls[0].isDisabled).toEqual(true);
  });
});
