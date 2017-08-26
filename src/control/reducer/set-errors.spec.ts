import { FormControlState, createFormControlState } from '../../state';
import { SetErrorsAction } from '../../actions';
import { setErrorsReducer } from './set-errors';

describe('form control setErrorsReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () => expect(setErrorsReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state if there are errors', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, errors));
    expect(resultState.errors).toBe(errors);
    expect(resultState.isValid).toBe(false);
    expect(resultState.isInvalid).toBe(true);
  });

  it('should update state if there are no errors', () => {
    const errors = { required: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
    const newErrors = {};
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, newErrors));
    expect(resultState.errors).toBe(newErrors);
    expect(resultState.isValid).toBe(true);
    expect(resultState.isInvalid).toBe(false);
  });

  it('should not update state if errors are same', () => {
    const errors = { required: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors));
    expect(resultState).toBe(state);
  });

  it('should not update state if control is disabled', () => {
    const errors = { required: true };
    const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors));
    expect(resultState).toBe(state);
  });

  it('should not update state if errors are equal and empty', () => {
    const resultState = setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, {}));
    expect(resultState).toBe(INITIAL_STATE);
  });
});
