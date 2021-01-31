import { EnableAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { enableReducer } from './enable';
import {
  FORM_CONTROL_ID,
  INITIAL_STATE,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${enableReducer.name}`, () => {
  it('should enable itself and all children recursively', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isEnabled', false], ['isDisabled', true]]);
    const resultState = enableReducer(state, EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should not update state if all children are enabled recursively', () => {
    const resultState = enableReducer(INITIAL_STATE, EnableAction(FORM_CONTROL_ID));
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
    const resultState = enableReducer(state, EnableAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE);
  });

  it('should forward actions to children', () => {
    const state = {
      ...INITIAL_STATE,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isEnabled: false,
          isDisabled: true,
        },
        INITIAL_STATE.controls[1],
      ],
    };
    const resultState = enableReducer(state, EnableAction(state.controls[0].id));
    expect(resultState).not.toBe(state);
  });

  it('should enable an empty disabled state', () => {
    const state = {
      ...createFormArrayState<string>(FORM_CONTROL_ID, []),
      isDisabled: true,
      isEnabled: false,
    };

    const resultState = enableReducer(state, EnableAction(FORM_CONTROL_ID));
    expect(resultState.isEnabled).toBe(true);
  });
});
