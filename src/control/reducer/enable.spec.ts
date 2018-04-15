import { EnableAction } from '../../actions';
import { createFormControlState } from '../../state';
import { enableReducer } from './enable';

describe('form control enableReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () => expect(enableReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state if disabled', () => {
    const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
    const resultState = enableReducer(state, new EnableAction(FORM_CONTROL_ID));
    expect(resultState.isEnabled).toEqual(true);
    expect(resultState.isDisabled).toEqual(false);
  });

  it('should not update state if enabled', () => {
    const resultState = enableReducer(INITIAL_STATE, new EnableAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });
});
