import {
  AddControlAction,
  DisableAction,
  EnableAction,
  FocusAction,
  MarkAsDirtyAction,
  MarkAsPristineAction,
  MarkAsSubmittedAction,
  MarkAsTouchedAction,
  MarkAsUnsubmittedAction,
  MarkAsUntouchedAction,
  RemoveControlAction,
  SetErrorsAction,
  SetUserDefinedPropertyAction,
  SetValueAction,
  UnfocusAction,
} from '../actions';
import { cast, createFormGroupState } from '../state';
import { formGroupReducerInternal } from './reducer';

describe('form group reducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

  it('should skip any action with non-equal control ID', () => {
    const resultState = formGroupReducerInternal(INITIAL_STATE, new SetValueAction('A' + FORM_CONTROL_ID, 'A') as any);
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should forward focus actions to children', () => {
    const resultState = formGroupReducerInternal(INITIAL_STATE, new FocusAction(FORM_CONTROL_INNER_ID) as any);
    expect(cast(resultState.controls.inner).isFocused).toEqual(true);
    expect(cast(resultState.controls.inner).isUnfocused).toEqual(false);
  });

  it('should forward unfocus actions to children', () => {
    const state = {
      ...INITIAL_STATE,
      controls: {
        inner: {
          ...INITIAL_STATE.controls.inner,
          isFocused: true,
          isUnfocused: false,
        },
      },
    };
    const resultState = formGroupReducerInternal(state, new UnfocusAction(FORM_CONTROL_INNER_ID) as any);
    expect(cast(resultState.controls.inner).isFocused).toEqual(false);
    expect(cast(resultState.controls.inner).isUnfocused).toEqual(true);
  });

  it('should not update state if no child was updated', () => {
    const resultState = formGroupReducerInternal(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, '') as any);
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should not update state value if no child value was updated', () => {
    const resultState = formGroupReducerInternal(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
    expect(resultState.value).toBe(INITIAL_STATE.value);
  });

  it('should not reset child states', () => {
    const value = 'A';
    const state = formGroupReducerInternal(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value) as any);
    const resultState = formGroupReducerInternal(state, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.value).toBe(value);
  });

  it('should not be stateful', () => {
    formGroupReducerInternal(INITIAL_STATE_FULL, new SetValueAction(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE));
    expect(() => formGroupReducerInternal(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID))).not.toThrowError();
  });

  it('should throw if trying to set a date as value', () => {
    const state = createFormGroupState<any>(FORM_CONTROL_ID, {});
    expect(() => formGroupReducerInternal(state, new SetValueAction(FORM_CONTROL_ID, new Date()))).toThrowError();
  });

  it('should throw if trying to set a date as a child value', () => {
    const state = createFormGroupState<any>(FORM_CONTROL_ID, { inner: null });
    expect(() => formGroupReducerInternal(state, new SetValueAction(FORM_CONTROL_INNER_ID, new Date()))).toThrowError();
  });

  describe(SetValueAction.name, () => {
    it('should update state', () => {
      const resultState = formGroupReducerInternal(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A' }));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(SetErrorsAction.name, () => {
    it('should update state', () => {
      const errors = { required: true };
      const resultState = formGroupReducerInternal(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, errors));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsDirtyAction.name, () => {
    it('should update state', () => {
      const resultState = formGroupReducerInternal(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsPristineAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
      const resultState = formGroupReducerInternal(state, new MarkAsPristineAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(EnableAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = formGroupReducerInternal(state, new EnableAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(DisableAction.name, () => {
    it('should update state', () => {
      const resultState = formGroupReducerInternal(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsTouchedAction.name, () => {
    it('should update state', () => {
      const resultState = formGroupReducerInternal(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsUntouchedAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      const resultState = formGroupReducerInternal(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsSubmittedAction.name, () => {
    it('should update state', () => {
      const resultState = formGroupReducerInternal(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(MarkAsUnsubmittedAction.name, () => {
    it('should update state', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = formGroupReducerInternal(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(AddControlAction.name, () => {
    it('should update state', () => {
      const action = new AddControlAction<FormGroupValue, 'inner2'>(FORM_CONTROL_ID, 'inner2', '');
      const resultState = formGroupReducerInternal<FormGroupValue>(INITIAL_STATE, action);
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });

  describe(RemoveControlAction.name, () => {
    it('should update state', () => {
      const action = new RemoveControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner2');
      const resultState = formGroupReducerInternal<FormGroupValue>(INITIAL_STATE_FULL, action);
      expect(resultState).not.toBe(INITIAL_STATE_FULL);
    });
  });

  describe(SetUserDefinedPropertyAction.name, () => {
    it('should update state', () => {
      const action = new SetUserDefinedPropertyAction(FORM_CONTROL_ID, 'prop', 12);
      const resultState = formGroupReducerInternal<FormGroupValue>(INITIAL_STATE_FULL, action);
      expect(resultState).not.toBe(INITIAL_STATE);
    });
  });
});
