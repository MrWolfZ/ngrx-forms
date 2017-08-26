import { ActionReducer } from '@ngrx/store';

// tslint:disable-next-line:no-unused-variable FormControlState is used as a Generic
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
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, 'A'));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(SetErrorsAction.name, () => {
    it('should update state', () => {
      const errors = { required: true };
      const resultState = reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, errors));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsDirtyAction.name, () => {
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsPristineAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
      const resultState = reducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(EnableAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = reducer(state, new EnableAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(DisableAction.name, () => {
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsTouchedAction.name, () => {
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsUntouchedAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      const resultState = reducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(FocusAction.name, () => {
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new FocusAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(UnfocusAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
      const resultState = reducer(state, new UnfocusAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(SetLastKeyDownCodeAction.name, () => {
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new SetLastKeyDownCodeAction(FORM_CONTROL_ID, 12));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsSubmittedAction.name, () => {
    it('should update state', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsUnsubmittedAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = reducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });
});
