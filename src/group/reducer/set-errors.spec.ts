import { createFormGroupState } from '../../state';
import { SetErrorsAction } from '../../actions';
import { setErrorsReducer } from './set-errors';

describe('form group setErrorsReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  const FORM_CONTROL_INNER5_ID = FORM_CONTROL_ID + '.inner5';
  const FORM_CONTROL_INNER5_0_ID = FORM_CONTROL_ID + '.inner5.0';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; inner5?: string[]; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' }, inner5: [''] };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

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

  it('should throw if trying to set invalid error value', () => {
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, null as any))).toThrowError();
    expect(() => setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, { _inner: true }))).toThrowError();
  });

  it('should aggregate child errors', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_INNER_ID, errors));
    expect(resultState.errors).toEqual({ _inner: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate child errors for group children', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE_FULL, new SetErrorsAction(FORM_CONTROL_INNER3_ID, errors));
    expect(resultState.errors).toEqual({ _inner3: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate child errors for array children', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE_FULL, new SetErrorsAction(FORM_CONTROL_INNER5_ID, errors));
    expect(resultState.errors).toEqual({ _inner5: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate nested child errors for group', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE_FULL, new SetErrorsAction(FORM_CONTROL_INNER4_ID, errors));
    expect(resultState.errors).toEqual({ _inner3: { _inner4: errors } });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate nested child errors for array', () => {
    const errors = { required: true };
    const resultState = setErrorsReducer(INITIAL_STATE_FULL, new SetErrorsAction(FORM_CONTROL_INNER5_0_ID, errors));
    expect(resultState.errors).toEqual({ _inner5: { _0: errors } });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate multiple child errors', () => {
    const errors1 = { required: true };
    const errors2 = { min: 0 };
    let resultState = setErrorsReducer(INITIAL_STATE_FULL, new SetErrorsAction(FORM_CONTROL_INNER_ID, errors1));
    resultState = setErrorsReducer(resultState, new SetErrorsAction(FORM_CONTROL_INNER3_ID, errors2));
    expect(resultState.errors).toEqual({ _inner: errors1, _inner3: errors2 });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should track child errors and own errors when own errors are changed', () => {
    const errors1 = { required: true };
    const errors2 = { min: 0 };
    const state = {
      ...INITIAL_STATE,
      errors: {
        _inner: errors2,
      },
      isValid: false,
      isInvalid: true,
      controls: {
        inner: {
          ...INITIAL_STATE.controls.inner,
          isValid: false,
          isInvalid: true,
          errors: errors2,
        },
      },
    };
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors1));
    expect(resultState.errors).toEqual({ ...errors1, _inner: errors2 });
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
    const resultState = setErrorsReducer(state, new SetErrorsAction(FORM_CONTROL_INNER_ID, errors2));
    expect(resultState.errors).toEqual({ ...errors1, _inner: errors2 });
  });
});
