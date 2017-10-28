import { DisableAction } from '../../actions';
import { cast, createFormGroupState } from '../../state';
import { disableReducer } from './disable';

describe('form group disableReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  const FORM_CONTROL_INNER5_ID = FORM_CONTROL_ID + '.inner5';
  const FORM_CONTROL_INNER5_0_ID = FORM_CONTROL_ID + '.inner5.0';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; inner5?: string[]; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' }, inner5: [''] };
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

  it('should disable direct array children', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isEnabled).toBe(false);
    expect(resultState.controls.inner5.isDisabled).toBe(true);
  });

  it('should disable nested children in group', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner3)!.controls.inner4.isEnabled).toBe(false);
    expect(cast(resultState.controls.inner3)!.controls.inner4.isDisabled).toBe(true);
  });

  it('should disable nested children in array', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner5)!.controls[0].isEnabled).toBe(false);
    expect(cast(resultState.controls.inner5)!.controls[0].isDisabled).toBe(true);
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
        inner5: {
          ...INITIAL_STATE_FULL.controls.inner5,
          isEnabled: false,
          isDisabled: true,
          controls: [
            {
              ...cast(INITIAL_STATE_FULL.controls.inner5)!.controls[0],
              isEnabled: false,
              isDisabled: true,
            },
          ],
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when direct array child is disabled', () => {
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
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isEnabled: false,
          isDisabled: true,
          controls: {
            inner4: {
              ...cast(INITIAL_STATE_FULL.controls.inner3)!.controls.inner4,
              isEnabled: false,
              isDisabled: true,
            },
          },
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should disable if all children are disabled when nested child in group is disabled', () => {
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
        inner5: {
          ...INITIAL_STATE_FULL.controls.inner5,
          isEnabled: false,
          isDisabled: true,
          controls: [
            {
              ...cast(INITIAL_STATE_FULL.controls.inner5)!.controls[0],
              isEnabled: false,
              isDisabled: true,
            },
          ],
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when nested child in group is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should disable if all children are disabled when nested child in array is disabled', () => {
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
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isEnabled: false,
          isDisabled: true,
          controls: {
            inner4: {
              ...cast(INITIAL_STATE_FULL.controls.inner3)!.controls.inner4,
              isEnabled: false,
              isDisabled: true,
            },
          },
        },
      },
    };
    const resultState = disableReducer(state, new DisableAction(FORM_CONTROL_INNER5_0_ID));
    expect(resultState.isEnabled).toBe(false);
    expect(resultState.isDisabled).toBe(true);
  });

  it('should not disable if not all children are disabled when nested child in array is disabled', () => {
    const resultState = disableReducer(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER5_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
  });

  it('should forward actions to children', () => {
    const resultState = disableReducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isEnabled).toEqual(false);
    expect(resultState.controls.inner.isDisabled).toEqual(true);
  });
});
