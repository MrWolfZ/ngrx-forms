import { createFormControlState } from '../../state';
import { SetAsyncErrorAction } from '../../actions';
import { setAsyncErrorReducer } from './set-async-error';

describe(`form control ${setAsyncErrorReducer.name}`, () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any action of the wrong type', () => expect(setAsyncErrorReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state with error', () => {
    const name = 'required';
    const value = true;
    const resultState = setAsyncErrorReducer(INITIAL_STATE, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.errors).toEqual({ ['$' + name]: value });
    expect(resultState.isValid).toBe(false);
    expect(resultState.isInvalid).toBe(true);
  });

  it('should not update state if errors are same', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { ['$' + name]: value } };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState).toBe(state);
  });

  it('should not update state if errors are equal', () => {
    const name = 'required';
    const value = { [name]: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { ['$' + name]: value } };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, { ...value }));
    expect(resultState).toBe(state);
  });

  it('should not update state if control is disabled', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState).toBe(state);
  });
});
