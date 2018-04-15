import { FocusAction } from '../../actions';
import { createFormControlState } from '../../state';
import { focusReducer } from './focus';

describe('form control focusReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () => expect(focusReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state if unfocused', () => {
    const resultState = focusReducer(INITIAL_STATE, new FocusAction(FORM_CONTROL_ID));
    expect(resultState.isFocused).toEqual(true);
    expect(resultState.isUnfocused).toEqual(false);
  });

  it('should not update state if focused', () => {
    const state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
    const resultState = focusReducer(state, new FocusAction(FORM_CONTROL_ID));
    expect(resultState).toBe(state);
  });
});
