import { SetAsyncErrorAction } from '../../actions';
import { setAsyncErrorReducer } from './set-async-error';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_1_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
} from './test-util';

describe(`form array ${setAsyncErrorReducer.name}`, () => {
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

  it('should aggregate child errors', () => {
    const name = 'required';
    const value = true;
    const state = {
      ...INITIAL_STATE,
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          pendingValidations: [name],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_0_ID, name, value));
    expect(resultState.errors).toEqual({ _0: { [`$${name}`]: value } });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should aggregate child errors for group children', () => {
    const name = 'required';
    const value = true;
    const state = {
      ...INITIAL_STATE_NESTED_GROUP,
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[0],
          pendingValidations: [name],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_0_ID, name, value));
    expect(resultState.errors).toEqual({ _0: { [`$${name}`]: value } });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should aggregate child errors for array children', () => {
    const name = 'required';
    const value = true;
    const state = {
      ...INITIAL_STATE_NESTED_ARRAY,
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[0],
          pendingValidations: [name],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_0_ID, name, value));
    expect(resultState.errors).toEqual({ _0: { [`$${name}`]: value } });
    expect(resultState.isValid).toEqual(false);
    expect(resultState.isInvalid).toEqual(true);
    expect(resultState.isValidationPending).toEqual(false);
  });

  it('should aggregate multiple child errors', () => {
    const name1 = 'required';
    const value1 = true;
    const name2 = 'min';
    const value2 = 0;
    const state = {
      ...INITIAL_STATE,
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          pendingValidations: [name1],
          isValidationPending: true,
        },
        {
          ...INITIAL_STATE.controls[1],
          pendingValidations: [name2],
          isValidationPending: true,
        },
      ],
    };
    let resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_0_ID, name1, value1));
    resultState = setAsyncErrorReducer(resultState, new SetAsyncErrorAction(FORM_CONTROL_1_ID, name2, value2));
    expect(resultState.errors).toEqual({ _0: { [`$${name1}`]: value1 }, _1: { [`$${name2}`]: value2 } });
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
        _0: { [`$${name2}`]: value2 },
      },
      isValid: false,
      isInvalid: true,
      pendingValidations: [name1],
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isValid: false,
          isInvalid: true,
          errors: { [`$${name2}`]: value2 },
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name1, value1));
    expect(resultState.errors).toEqual({ [`$${name1}`]: value1, _0: { [`$${name2}`]: value2 } });
  });

  it('should track own errors and child errors when child errors are changed', () => {
    const name1 = 'required';
    const value1 = true;
    const name2 = 'min';
    const value2 = 0;
    const state = {
      ...INITIAL_STATE,
      isValid: false,
      isInvalid: true,
      errors: { [`$${name1}`]: value1 },
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          pendingValidations: [name2],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_0_ID, name2, value2));
    expect(resultState.errors).toEqual({ [`$${name1}`]: value1, _0: { [`$${name2}`]: value2 } });
  });

  it('should mark state as validation pending if child control is validation pending', () => {
    const name = 'required';
    const value = true;
    const state = {
      ...INITIAL_STATE,
      pendingValidations: [name],
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          pendingValidations: [name],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toEqual(true);
  });

  it('should mark state as validation pending if child group is validation pending', () => {
    const name = 'required';
    const value = true;
    const state = {
      ...INITIAL_STATE_NESTED_GROUP,
      pendingValidations: [name],
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[0],
          pendingValidations: [name],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toEqual(true);
  });

  it('should mark state as validation pending if child array is validation pending', () => {
    const name = 'required';
    const value = true;
    const state = {
      ...INITIAL_STATE_NESTED_ARRAY,
      pendingValidations: [name],
      isValidationPending: true,
      controls: [
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[0],
          pendingValidations: [name],
          isValidationPending: true,
        },
      ],
    };
    const resultState = setAsyncErrorReducer(state, new SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
    expect(resultState.pendingValidations).toEqual([]);
    expect(resultState.isValidationPending).toEqual(true);
  });
});
