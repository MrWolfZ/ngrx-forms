import { FormGroupState, createFormGroupState } from '../../state';
import { DisableAction } from '../../actions';
import { disableReducer } from './disable';

describe('form group disableReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

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

  it('should disable direct control children', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isEnabled).toBe(false);
    expect(resultState.controls.inner.isDisabled).toBe(true);
  });

  it('should disable direct group children', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isEnabled).toBe(false);
    expect(resultState.controls.inner3.isDisabled).toBe(true);
  });

  it('should disable nested children', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isEnabled).toBe(false);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when direct control child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when direct control child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should disable if all children are disabled when direct group child is disabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
        inner2: {
          ...INITIAL_STATE_FULL.controls.inner2,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when nested child is disabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
        inner2: {
          ...INITIAL_STATE_FULL.controls.inner2,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when nested child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should disable if all children are disabled when direct control child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when direct control child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should disable if all children are disabled when direct group child is disabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
        inner2: {
          ...INITIAL_STATE_FULL.controls.inner2,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when nested child is disabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
        inner2: {
          ...INITIAL_STATE_FULL.controls.inner2,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when nested child is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should forward actions to children', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isEnabled).toEqual(false);
    expect(resultState.controls.inner.isDisabled).toEqual(true);
  });
});
