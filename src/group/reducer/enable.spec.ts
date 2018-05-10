import { EnableAction } from '../../actions';
import { enableReducer } from './enable';
import { FORM_CONTROL_ID, INITIAL_STATE_FULL, setPropertiesRecursively } from './test-util';

describe(`form group ${enableReducer.name}`, () => {
  it('should enable itself and all children recursively', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isEnabled', false], ['isDisabled', true]]);
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

  it('should forward actions to children', () => {
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
    const resultState = enableReducer(state, new EnableAction(state.controls.inner2.id));
    expect(resultState).not.toBe(state);
  });
});
