import { SetAsyncErrorAction } from '../../actions';
import { createFormControlState } from '../../state';
import { setAsyncErrorReducer } from './set-async-error';

describe(`form control ${setAsyncErrorReducer.name}`, () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any action of the wrong type', () => expect(setAsyncErrorReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state with error', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, pendingValidations: [name], isValidationPending: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.errors).toEqual({ [`$${name}`]: value });
    expect(resultState.isValid).toBe(false);
    expect(resultState.isInvalid).toBe(true);
  });

  it('should remove the validation from pending validations if validation is the last pending', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, pendingValidations: [name], isValidationPending: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toBe(false);
  });

  it('should remove the validation from pending validations if validation is not the last pending', () => {
    const name = 'required';
    const name2 = 'min';
    const value = true;
    const state = { ...INITIAL_STATE, pendingValidations: [name, name2], isValidationPending: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.pendingValidations).toEqual([name2]);
    expect(resultState.isValidationPending).toBe(true);
  });

  it('should remove pending validation without changing the error if error value is the same', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { [`$${name}`]: value }, pendingValidations: [name], isValidationPending: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.errors[`$${name}`]).toBe(value);
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toBe(false);
  });

  it('should remove pending validation without changing the error if error value is equal', () => {
    const name = 'required';
    const value = { field: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { [`$${name}`]: value }, pendingValidations: [name], isValidationPending: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, { ...value }));
    expect(resultState.errors[`$${name}`]).toBe(value);
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toBe(false);
  });

  it('should not update state if control is disabled', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState).toBe(state);
  });

  it('should update state even if no matching pending validation is found', () => {
    const name = 'required';
    const value = true;
    const state = { ...INITIAL_STATE, pendingValidations: ['min'], isValidationPending: true };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.errors).toEqual({ [`$${name}`]: value });
    expect(resultState.isValid).toBe(false);
    expect(resultState.isInvalid).toBe(true);
  });
});
