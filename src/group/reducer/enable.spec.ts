import { FormGroupState, createFormGroupState } from '../../state';
import { EnableAction } from '../../actions';
import { enableReducer } from './enable';

describe('form group enableReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER2_ID = FORM_CONTROL_ID + '.inner2';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

  it('should enable itself and all children recursively', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isEnabled: false,
      isDisabled: true,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
        inner3: {
          ...inner3State,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isEnabled: false,
              isDisabled: true,
            },
          },
        },
      },
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL);
  });

  it('should not update state if all children are enabled recursively', () => {
    const resultState = enableReducer(INITIAL_STATE, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should enable children if the group itself is already enabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner2: {
          ...INITIAL_STATE_FULL.controls.inner2,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL);
  });

  it('should enable if direct control child gets enabled', () => {
    const state = {
      ...INITIAL_STATE,
      isEnabled: false,
      isDisabled: true,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should enable without enabling any other children if direct group child gets enabled', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isEnabled: false,
      isDisabled: true,
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
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER2_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls.inner.isEnabled).toBe(false);
    expect(resultState.controls.inner.isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if nested child gets enabled', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isEnabled: false,
      isDisabled: true,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
        inner3: {
          ...inner3State,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isEnabled: false,
              isDisabled: true,
            },
          },
        },
      },
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls.inner.isEnabled).toBe(false);
    expect(resultState.controls.inner.isDisabled).toBe(true);
  });

  it('should forward actions to children', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isEnabled).toEqual(true);
    expect(resultState.controls.inner.isDisabled).toEqual(false);
  });
});
