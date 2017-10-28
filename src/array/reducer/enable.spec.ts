import { EnableAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { enableReducer } from './enable';

describe('form group enableReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_0_ID = FORM_CONTROL_ID + '.0';
  const FORM_CONTROL_1_ID = FORM_CONTROL_ID + '.1';
  const INITIAL_FORM_ARRAY_VALUE = ['', ''];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: '' }, { inner2: '' }];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [[''], ['']];
  const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
  const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
  const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);

  it('should enable itself and all children recursively', () => {
    const state = {
      ...INITIAL_STATE,
      isEnabled: false,
      isDisabled: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isEnabled: false,
          isDisabled: true,
        },
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

  it('should enable if direct control child gets enabled', () => {
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
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_1_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should enable without enabling any other children if direct control child gets enabled', () => {
    const state = {
      ...INITIAL_STATE,
      isEnabled: false,
      isDisabled: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isEnabled: false,
          isDisabled: true,
        },
        {
          ...INITIAL_STATE.controls[1],
          isEnabled: false,
          isDisabled: true,
        },
      ],
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if direct group child gets enabled', () => {
    const state = {
      ...INITIAL_STATE_NESTED_GROUP,
      isEnabled: false,
      isDisabled: true,
      controls: [
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[0],
          isEnabled: false,
          isDisabled: true,
        },
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[1],
          isEnabled: false,
          isDisabled: true,
        },
      ],
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });

  it('should enable without enabling any other children if direct array child gets enabled', () => {
    const state = {
      ...INITIAL_STATE_NESTED_ARRAY,
      isEnabled: false,
      isDisabled: true,
      controls: [
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[0],
          isEnabled: false,
          isDisabled: true,
        },
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[1],
          isEnabled: false,
          isDisabled: true,
        },
      ],
    };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_0_ID));
    expect(resultState.isEnabled).toBe(true);
    expect(resultState.isDisabled).toBe(false);
    expect(resultState.controls[1].isEnabled).toBe(false);
    expect(resultState.controls[1].isDisabled).toBe(true);
  });

  it('should forward actions to children', () => {
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
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_1_ID));
    expect(resultState.controls[1].isEnabled).toEqual(true);
    expect(resultState.controls[1].isDisabled).toEqual(false);
  });
});
