import { ClearAsyncErrorAction } from '../../actions';
import { clearAsyncErrorReducer } from './clear-async-error';
import { FORM_CONTROL_ID, FORM_CONTROL_INNER_ID, INITIAL_STATE, INITIAL_STATE_FULL } from './test-util';

describe(`form group ${clearAsyncErrorReducer.name}`, () => {
  it('should skip any action of the wrong type', () => expect(clearAsyncErrorReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should remove error from state', () => {
    const name = 'required';
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { [`$${name}`]: true }, pendingValidations: [name], isValidationPending: true };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toEqual({});
    expect(resultState.isValid).toBe(true);
    expect(resultState.isInvalid).toBe(false);
  });

  it('should remove the validation from pending validations if validation is the last pending', () => {
    const name = 'required';
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors: { [`$${name}`]: true }, pendingValidations: [name], isValidationPending: true };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toBe(false);
  });

  it('should remove the validation from pending validations if validation is not the last pending', () => {
    const name = 'required';
    const name2 = 'min';
    const state = {
      ...INITIAL_STATE,
      isValid: false,
      isInvalid: true,
      errors: { [`$${name}`]: true },
      pendingValidations: [name, name2],
      isValidationPending: true,
    };

    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([name2]);
    expect(resultState.isValidationPending).toBe(true);
  });

  it('should remove pending validation without changing the errors if no matching error is found', () => {
    const name = 'required';
    const errors = { $min: true };
    const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors, pendingValidations: [name], isValidationPending: true };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toBe(errors);
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toBe(false);
  });

  it('should not update state if no matching error or pending validation is found', () => {
    const name = 'required';
    const state = {
      ...INITIAL_STATE,
      isValid: false,
      isInvalid: true,
      errors: { $min: true },
      pendingValidations: ['min'],
      isValidationPending: true,
    };

    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState).toBe(state);
  });

  it('should remove the error if no matching pending validation is found', () => {
    const name = 'required';
    const state = {
      ...INITIAL_STATE,
      isValid: false,
      isInvalid: true,
      errors: { [`$${name}`]: true },
      pendingValidations: ['min'],
      isValidationPending: true,
    };

    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toEqual({});
    expect(resultState.isValid).toBe(true);
    expect(resultState.isInvalid).toBe(false);
    expect(resultState.pendingValidations).toEqual(state.pendingValidations);
    expect(resultState.isValidationPending).toBe(true);
  });

  it('should aggregate child errors', () => {
    const name = 'required';
    const value = true;
    const errors = { min: 0 };
    const state = {
      ...INITIAL_STATE,
      pendingValidations: [name],
      isValidationPending: true,
      errors: { [`$${name}`]: value },
      controls: {
        inner: {
          ...INITIAL_STATE.controls.inner,
          isValid: false,
          isInvalid: true,
          errors,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toEqual({ _inner: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should aggregate child errors for group children', () => {
    const name = 'required';
    const value = true;
    const errors = { min: 0 };
    const state = {
      ...INITIAL_STATE_FULL,
      pendingValidations: [name],
      isValidationPending: true,
      errors: {
        [`$${name}`]: value,
        _inner3: errors,
      },
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3!,
          isValid: false,
          isInvalid: true,
          errors,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toEqual({ _inner3: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should aggregate child errors for array children', () => {
    const name = 'required';
    const value = true;
    const errors = { min: 0 };
    const state = {
      ...INITIAL_STATE_FULL,
      pendingValidations: [name],
      isValidationPending: true,
      errors: {
        [`$${name}`]: value,
        _inner5: errors,
      },
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner5: {
          ...INITIAL_STATE_FULL.controls.inner5!,
          isValid: false,
          isInvalid: true,
          errors,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toEqual({ _inner5: errors });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
  });

  it('should aggregate multiple child errors', () => {
    const name = 'required';
    const value = true;
    const errors1 = { min: 0 };
    const errors2 = { max: 0 };
    const state = {
      ...INITIAL_STATE_FULL,
      pendingValidations: [name],
      isValidationPending: true,
      errors: {
        [`$${name}`]: value,
        _inner: errors1,
        _inner3: errors2,
      },
      controls: {
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isValid: false,
          isInvalid: true,
          errors: errors1,
        },
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3!,
          isValid: false,
          isInvalid: true,
          errors: errors2,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.errors).toEqual({ _inner: errors1, _inner3: errors2 });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should track child errors and own errors when own errors are changed', () => {
    const name1 = 'required';
    const value1 = true;
    const name2 = 'min';
    const value2 = 0;
    const state = {
      ...INITIAL_STATE,
      errors: {
        [`$${name1}`]: value1,
        _inner: { [`$${name2}`]: value2 },
      },
      isValid: false,
      isInvalid: true,
      pendingValidations: [name1],
      isValidationPending: true,
      controls: {
        inner: {
          ...INITIAL_STATE.controls.inner,
          isValid: false,
          isInvalid: true,
          errors: { [`$${name2}`]: value2 },
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name1));
    expect(resultState.errors).toEqual({ _inner: { [`$${name2}`]: value2 } });
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should track own errors and child errors when child errors are changed', () => {
    const name1 = 'required';
    const value1 = true;
    const name2 = 'min';
    const value2 = 0;
    const state = {
      ...INITIAL_STATE,
      errors: {
        [`$${name1}`]: value1,
        _inner: { [`$${name2}`]: value2 },
      },
      isValid: false,
      isInvalid: true,
      isValidationPending: true,
      controls: {
        inner: {
          ...INITIAL_STATE.controls.inner,
          isValid: false,
          isInvalid: true,
          errors: { [`$${name2}`]: value2 },
          pendingValidations: [name2],
          isValidationPending: true,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_INNER_ID, name2));
    expect(resultState.errors).toEqual({ [`$${name1}`]: value1 });
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should mark state as validation pending if child control is validation pending', () => {
    const name = 'required';
    const state = {
      ...INITIAL_STATE,
      pendingValidations: [name],
      isValidationPending: true,
      controls: {
        inner: {
          ...INITIAL_STATE.controls.inner,
          pendingValidations: [name],
          isValidationPending: true,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toEqual(true);
  });

  it('should mark state as validation pending if child group is validation pending', () => {
    const name = 'required';
    const state = {
      ...INITIAL_STATE_FULL,
      pendingValidations: [name],
      isValidationPending: true,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3!,
          pendingValidations: [name],
          isValidationPending: true,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toEqual(true);
  });

  it('should mark state as validation pending if child array is validation pending', () => {
    const name = 'required';
    const state = {
      ...INITIAL_STATE_FULL,
      pendingValidations: [name],
      isValidationPending: true,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner5: {
          ...INITIAL_STATE_FULL.controls.inner5!,
          pendingValidations: [name],
          isValidationPending: true,
        },
      },
    };
    const resultState = clearAsyncErrorReducer(state, new ClearAsyncErrorAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toEqual(true);
  });
});
