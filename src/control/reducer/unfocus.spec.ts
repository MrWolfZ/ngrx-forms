import { UnfocusAction } from '../../actions';
import { createFormControlState } from '../../state';
import { unfocusReducer } from './unfocus';

describe('form control unfocusReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () => expect(unfocusReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state if focused', () => {
    const state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
    const resultState = unfocusReducer(state, new UnfocusAction(FORM_CONTROL_ID));
    expect(resultState.isFocused).toEqual(false);
    expect(resultState.isUnfocused).toEqual(true);
  });

  it('should not update state if unfocused', () => {
    const resultState = unfocusReducer(INITIAL_STATE, new UnfocusAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });
});
