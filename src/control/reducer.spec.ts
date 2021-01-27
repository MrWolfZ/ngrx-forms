import {
  ClearAsyncErrorAction,
  DisableAction,
  EnableAction,
  FocusAction,
  MarkAsDirtyAction,
  MarkAsPristineAction,
  MarkAsSubmittedAction,
  MarkAsTouchedAction,
  MarkAsUnsubmittedAction,
  MarkAsUntouchedAction,
  ResetAction,
  SetAsyncErrorAction,
  SetErrorsAction,
  SetUserDefinedPropertyAction,
  SetValueAction,
  StartAsyncValidationAction,
  UnfocusAction,
} from '../actions';
import { createFormControlState } from '../state';
import { formControlReducer } from './reducer';

describe('form control reducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any action with non-equal control ID', () => {
    const resultState = formControlReducer(INITIAL_STATE, SetValueAction(`${FORM_CONTROL_ID}A`, 'A'));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should preserve the order of properties when stringified', () => {
    const expected = JSON.stringify(INITIAL_STATE);
    let state = formControlReducer(INITIAL_STATE, MarkAsDirtyAction(FORM_CONTROL_ID));
    state = formControlReducer(state, MarkAsPristineAction(FORM_CONTROL_ID));
    expect(JSON.stringify(state)).toEqual(expected);
  });

  it('should throw if state is undefined', () => {
    expect(() => formControlReducer(undefined, { type: '' })).toThrowError();
  });

  it('should throw if state is not a control state', () => {
    expect(() => formControlReducer({ ...INITIAL_STATE, value: [], controls: [] } as any, MarkAsDirtyAction(FORM_CONTROL_ID))).toThrowError();
  });

  describe(SetValueAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, SetValueAction(FORM_CONTROL_ID, 'A'));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(SetErrorsAction.name, () => {
    it('should update state', () => {
      const errors = { required: true };
      const resultState = formControlReducer(INITIAL_STATE, SetErrorsAction(FORM_CONTROL_ID, errors));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(StartAsyncValidationAction.name, () => {
    it('should update state', () => {
      const name = 'required';
      const resultState = formControlReducer(INITIAL_STATE, StartAsyncValidationAction(FORM_CONTROL_ID, name));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(SetAsyncErrorAction.name, () => {
    it('should update state', () => {
      const name = 'required';
      const value = true;
      const state = { ...INITIAL_STATE, pendingValidations: [name], isValidationPending: true };
      const resultState = formControlReducer(state, SetAsyncErrorAction(FORM_CONTROL_ID, name, value));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(ClearAsyncErrorAction.name, () => {
    it('should update state', () => {
      const name = 'required';
      const state = {
        ...INITIAL_STATE,
        isValid: false,
        isInvalid: true,
        errors: { [`$${name}`]: true },
        pendingValidations: [name],
        isValidationPending: true,
      };

      const resultState = formControlReducer(state, ClearAsyncErrorAction(FORM_CONTROL_ID, name));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsDirtyAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, MarkAsDirtyAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsPristineAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
      const resultState = formControlReducer(state, MarkAsPristineAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(EnableAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = formControlReducer(state, EnableAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(DisableAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, DisableAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsTouchedAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsUntouchedAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      const resultState = formControlReducer(state, MarkAsUntouchedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(FocusAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, FocusAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(UnfocusAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
      const resultState = formControlReducer(state, UnfocusAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(SetUserDefinedPropertyAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, SetUserDefinedPropertyAction(FORM_CONTROL_ID, 'prop', 12));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsSubmittedAction.name, () => {
    it('should update state', () => {
      const resultState = formControlReducer(INITIAL_STATE, MarkAsSubmittedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsUnsubmittedAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = formControlReducer(state, MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(ResetAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = formControlReducer(state, ResetAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });
});
