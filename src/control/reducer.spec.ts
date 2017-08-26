import { ActionReducer } from '@ngrx/store';

import { FormControlState, createFormControlState } from '../state';
import {
  SetValueAction,
  SetErrorsAction,
  MarkAsDirtyAction,
  MarkAsPristineAction,
  EnableAction,
  DisableAction,
  MarkAsTouchedAction,
  MarkAsUntouchedAction,
  FocusAction,
  UnfocusAction,
  SetLastKeyDownCodeAction,
  MarkAsSubmittedAction,
  MarkAsUnsubmittedAction,
} from '../actions';
import { formControlReducerInternal } from './reducer';

describe('form control reducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  const reducer: ActionReducer<FormControlState<string>> = formControlReducerInternal;

  it('should skip any action with non-equal control ID', () => {
    const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID + 'A', 'A'));
    expect(resultState).toBe(INITIAL_STATE);
  });

  describe(SetValueAction.name, () => {
    it('should update state value if different', () => {
      const value = 'A';
      const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
      expect(resultState.value).toEqual(value);
    });

    it('should not update state value if same', () => {
      const value = 'A';
      const state = { ...INITIAL_STATE, value };
      const resultState = reducer(state, new SetValueAction(FORM_CONTROL_ID, value));
      expect(resultState).toBe(state);
    });

    it('should mark state as dirty if value is different', () => {
      const value = 'A';
      const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
      expect(resultState.isDirty).toEqual(true);
    });

    it('should throw for date values', () => {
      const value = new Date(1970, 0, 1);
      const state = createFormControlState<null>(FORM_CONTROL_ID, null);
      const dateReducer: ActionReducer<FormControlState<null>> = formControlReducerInternal;
      expect(() => dateReducer(state, new SetValueAction(FORM_CONTROL_ID, value))).toThrowError();
    });

    it('should throw if value is not supported', () => {
      const value = {};
      expect(() => reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value))).toThrowError();
    });
  });

  describe(SetErrorsAction.name, () => {
    it('should update state if there are errors', () => {
      const errors = { required: true };
      const resultState = reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, errors));
      expect(resultState.errors).toBe(errors);
      expect(resultState.isValid).toBe(false);
      expect(resultState.isInvalid).toBe(true);
    });

    it('should update state if there are no errors', () => {
      const errors = { required: true };
      const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
      const newErrors = {};
      const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_ID, newErrors));
      expect(resultState.errors).toBe(newErrors);
      expect(resultState.isValid).toBe(true);
      expect(resultState.isInvalid).toBe(false);
    });

    it('should not update state if errors are same', () => {
      const errors = { required: true };
      const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
      const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors));
      expect(resultState).toBe(state);
    });

    it('should not update state if control is disabled', () => {
      const errors = { required: true };
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors));
      expect(resultState).toBe(state);
    });

    it('should not update state if errors are equal and empty', () => {
      const resultState = reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, {}));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsDirtyAction.name, () => {
    it('should update state if pristine', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
      expect(resultState.isDirty).toEqual(true);
      expect(resultState.isPristine).toEqual(false);
    });

    it('should not update state if dirty', () => {
      const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
      const resultState = reducer(state, new MarkAsDirtyAction(FORM_CONTROL_ID));
      expect(resultState).toBe(state);
    });
  });

  describe(MarkAsPristineAction.name, () => {
    it('should update state if dirty', () => {
      const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
      const resultState = reducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
      expect(resultState.isDirty).toEqual(false);
      expect(resultState.isPristine).toEqual(true);
    });

    it('should not update state if pristine', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsPristineAction(FORM_CONTROL_ID));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });

  describe(EnableAction.name, () => {
    it('should update state if disabled', () => {
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = reducer(state, new EnableAction(FORM_CONTROL_ID));
      expect(resultState.isEnabled).toEqual(true);
      expect(resultState.isDisabled).toEqual(false);
    });

    it('should not update state if enabled', () => {
      const resultState = reducer(INITIAL_STATE, new EnableAction(FORM_CONTROL_ID));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });

  describe(DisableAction.name, () => {
    it('should update state if enabled', () => {
      const resultState = reducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
      expect(resultState.isEnabled).toEqual(false);
      expect(resultState.isDisabled).toEqual(true);
    });

    it('should not update state if disabled', () => {
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = reducer(state, new DisableAction(FORM_CONTROL_ID));
      expect(resultState).toBe(state);
    });

    it('should mark the state as valid and clear all errors', () => {
      const errors = { required: true };
      const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
      const resultState = reducer(state, new DisableAction(FORM_CONTROL_ID));
      expect(resultState.isValid).toEqual(true);
      expect(resultState.isInvalid).toEqual(false);
      expect(resultState.errors).toEqual({});
    });
  });

  describe(MarkAsTouchedAction.name, () => {
    it('should update state if untouched', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState.isTouched).toEqual(true);
      expect(resultState.isUntouched).toEqual(false);
    });

    it('should not update state if touched', () => {
      const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      const resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState).toBe(state);
    });
  });

  describe(MarkAsUntouchedAction.name, () => {
    it('should update state if touched', () => {
      const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      const resultState = reducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
      expect(resultState.isTouched).toEqual(false);
      expect(resultState.isUntouched).toEqual(true);
    });

    it('should not update state if untouched', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsUntouchedAction(FORM_CONTROL_ID));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });

  describe(FocusAction.name, () => {
    it('should update state if unfocused', () => {
      const resultState = reducer(INITIAL_STATE, new FocusAction(FORM_CONTROL_ID));
      expect(resultState.isFocused).toEqual(true);
      expect(resultState.isUnfocused).toEqual(false);
    });

    it('should not update state if focused', () => {
      const state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
      const resultState = reducer(state, new FocusAction(FORM_CONTROL_ID));
      expect(resultState).toBe(state);
    });
  });

  describe(UnfocusAction.name, () => {
    it('should update state if focused', () => {
      const state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
      const resultState = reducer(state, new UnfocusAction(FORM_CONTROL_ID));
      expect(resultState.isFocused).toEqual(false);
      expect(resultState.isUnfocused).toEqual(true);
    });

    it('should not update state if unfocused', () => {
      const resultState = reducer(INITIAL_STATE, new UnfocusAction(FORM_CONTROL_ID));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });

  describe(SetLastKeyDownCodeAction.name, () => {
    it('should update state lastKeyDownCode if different', () => {
      const lastKeyDownCode = 12;
      const resultState = reducer(INITIAL_STATE, new SetLastKeyDownCodeAction(FORM_CONTROL_ID, lastKeyDownCode));
      expect(resultState.lastKeyDownCode).toEqual(lastKeyDownCode);
    });

    it('should not update state lastKeyDownCode if same', () => {
      const lastKeyDownCode = 12;
      const state = { ...INITIAL_STATE, lastKeyDownCode };
      const resultState = reducer(state, new SetLastKeyDownCodeAction(FORM_CONTROL_ID, lastKeyDownCode));
      expect(resultState).toBe(state);
    });
  });

  describe(MarkAsSubmittedAction.name, () => {
    it('should update state if unsubmitted', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_ID));
      expect(resultState.isSubmitted).toEqual(true);
      expect(resultState.isUnsubmitted).toEqual(false);
    });

    it('should not update state if submitted', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = reducer(state, new MarkAsSubmittedAction(FORM_CONTROL_ID));
      expect(resultState).toBe(state);
    });
  });

  describe(MarkAsUnsubmittedAction.name, () => {
    it('should update state if submitted', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = reducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState.isSubmitted).toEqual(false);
      expect(resultState.isUnsubmitted).toEqual(true);
    });

    it('should not update state if unsubmitted', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });
});
