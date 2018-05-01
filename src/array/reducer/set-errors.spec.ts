import { SetErrorsAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { setErrorsReducer } from './set-errors';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_1_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
} from './test-util';

describe(`form array ${setErrorsReducer.name}`, () => {
  it('should update state if there are errors', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, errors));
    expect(resultState.errors).toEqual(errors);
    expect(resultState.isValid).toBe(false);
    expect(resultState.isInvalid).toBe(true);
  });

  it('should update state if there are no errors', () => {
    const errors = { required: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, {}));
    expect(resultState.errors).toEqual({});
    expect(resultState.isValid).toBe(true);
    expect(resultState.isInvalid).toBe(false);
  });

  it('should not update state if errors are same', () => {
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { required: true } };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, state.errors));
    expect(resultState).toBe(state);
  });

  it('should not update state if errors are equal', () => {
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { required: true } };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, { required: true }));
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

  it('should update state if array is empty', () => {
    const errors = { required: true };
    const state = createFormArrayState<string>('test ID', []);
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors));
    expect(resultState.errors).toEqual(errors);
    expect(resultState.isValid).toBe(false);
    expect(resultState.isInvalid).toBe(true);
  });

  it('should keep async errors', () => {
    const syncErrors = { required: true };
    const asyncErrors = { $required: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: asyncErrors };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, syncErrors));
    expect(resultState.errors).toEqual({ ...asyncErrors, ...syncErrors });
  });

  it('should throw if trying to set invalid error value', () => {
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, null as any))).toThrowError();
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, 1 as any))).toThrowError();
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, [] as any))).toThrowError();
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, { $required: true }))).toThrowError();
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, { _inner: true }))).toThrowError();
  });

  it('should aggregate child errors', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_0_ID, errors));
    expect(resultState.errors).toEqual({ _0: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate child errors for group children', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE_NESTED_GROUP, new SetErrorsAction(FORM_CONTROL_0_ID, errors));
    expect(resultState.errors).toEqual({ _0: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate child errors for array children', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE_NESTED_ARRAY, new SetErrorsAction(FORM_CONTROL_0_ID, errors));
    expect(resultState.errors).toEqual({ _0: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate multiple child errors', () => {
    const errors1 = { required: true };
    const errors2 = { min: 0 };
    let resultState = setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_0_ID, errors1));
    resultState = setErrorsReducer(resultState, new SetErrorsAction(FORM_CONTROL_1_ID, errors2));
    expect(resultState.errors).toEqual({ _0: errors1, _1: errors2 });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should track child errors and own errors when own errors are changed', () => {
    const errors1 = { required: true };
    const errors2 = { min: 0 };
    const state = {
      ...INITIAL_STATE,
      errors: {
        _0: errors2,
      },
      isValid: false,
      isInvalid: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isValid: false,
          isInvalid: true,
          errors: errors2,
        },
      ],
    };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors1));
    expect(resultState.errors).toEqual({ ...errors1, _0: errors2 });
  });

  it('should track own errors and child errors when child errors are changed', () => {
    const errors1 = { required: true };
    const state = {
      ...INITIAL_STATE,
      isValid: false,
      isInvalid: true,
      errors: errors1,
    };
    const errors2 = { min: 0 };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_0_ID, errors2));
    expect(resultState.errors).toEqual({ ...errors1, _0: errors2 });
  });
});
