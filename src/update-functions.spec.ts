import { SetValueAction, MarkAsTouchedAction } from './actions';
import { FormGroupState, createFormGroupState, cast } from './state';
import {
  updateGroup,
  groupUpdateReducer,
  setValue,
  validate,
  enable,
  disable,
  markAsDirty,
  markAsPristine,
  markAsTouched,
  markAsUntouched,
  markAsSubmitted,
  markAsUnsubmitted,
  focus,
  unfocus,
  setLastKeyDownCode,
  addControl,
  removeControl,
} from './update-functions';

describe('update functions', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  interface NestedValue { inner4: string; }
  interface FormGroupValue { inner: string; inner2?: string; inner3?: NestedValue; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  describe(updateGroup.name, () => {
    it('should apply the provided functions to direct control children', () => {
      const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
      const resultState = updateGroup<FormGroupValue>({
        inner: () => expected,
      })(INITIAL_STATE);
      expect(resultState.controls.inner).toBe(expected);
    });

    it('should apply the provided functions to group children', () => {
      const expected = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
      const resultState = updateGroup<FormGroupValue>({
        inner3: () => expected,
      })(INITIAL_STATE);
      expect(resultState.controls.inner3).toBe(expected);
    });

    it('should apply the provided functions to nested children', () => {
      const expected = { ...(INITIAL_STATE.controls.inner3 as FormGroupState<NestedValue>).controls.inner4, value: 'A' };
      const resultState = updateGroup<FormGroupValue>({
        inner3: updateGroup<NestedValue>({
          inner4: () => expected,
        }),
      })(INITIAL_STATE);
      expect((resultState.controls.inner3 as FormGroupState<NestedValue>).controls.inner4).toBe(expected);
    });

    it('should pass the parent group as the second parameter', () => {
      updateGroup<FormGroupValue>({
        inner3: (c, p) => {
          expect(p).toBe(INITIAL_STATE);
          return c;
        },
      })(INITIAL_STATE);
    });
  });

  describe(groupUpdateReducer.name, () => {
    it('should apply the action and the provided functions to direct control children', () => {
      const value = 'A';
      const resultState = groupUpdateReducer<FormGroupValue>({
        inner: s => ({ ...s, value }),
      })(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState.controls.inner.isTouched).toBe(true);
      expect(resultState.controls.inner.value).toBe(value);
    });

    it('should apply the action and the provided functions to group children', () => {
      const value = { inner4: 'A' };
      const resultState = groupUpdateReducer<FormGroupValue>({
        inner3: s => ({ ...s, value }),
      })(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect(resultState.controls.inner3.isTouched).toBe(true);
      expect(resultState.controls.inner3.value).toBe(value);
    });

    it('should apply the action and the provided functions to nested children', () => {
      const value = 'A';
      const resultState = groupUpdateReducer<FormGroupValue>({
        inner3: updateGroup<NestedValue>({
          inner4: s => ({ ...s, value }),
        }),
      })(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
      expect((resultState.controls.inner3 as FormGroupState<NestedValue>).controls.inner4.isTouched).toBe(true);
      expect((resultState.controls.inner3 as FormGroupState<NestedValue>).controls.inner4.value).toBe(value);
    });

    it('should first apply the action and then the provided functions', () => {
      const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
      const resultState = groupUpdateReducer<FormGroupValue>({
        inner: () => expected,
      })(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, 'B'));
      expect(resultState.controls.inner).toBe(expected);
    });
  });

  describe(setValue.name, () => {
    it('should call reducer for controls', () => {
      const resultState = setValue<string>('A')(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = setValue<FormGroupValue>({ inner: 'A' })(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(validate.name, () => {
    it('should call reducer for controls', () => {
      const errors = { required: true };
      const resultState = validate<string>(() => errors)(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const errors = { required: true };
      const resultState = validate<FormGroupValue>(() => errors)(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(enable.name, () => {
    it('should call reducer for controls', () => {
      const state = { ...INITIAL_STATE.controls.inner, isEnabled: false, isDisabled: true };
      const resultState = enable(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const resultState = enable(state);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(disable.name, () => {
    it('should call reducer for controls', () => {
      const resultState = disable(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = disable(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(markAsDirty.name, () => {
    it('should call reducer for controls', () => {
      const resultState = markAsDirty(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = markAsDirty(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(markAsPristine.name, () => {
    it('should call reducer for controls', () => {
      const state = { ...INITIAL_STATE.controls.inner, isDirty: false, isPristine: true };
      const resultState = markAsPristine(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const state = { ...INITIAL_STATE, isDirty: false, isPristine: true };
      const resultState = markAsPristine(state);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(markAsTouched.name, () => {
    it('should call reducer for controls', () => {
      const resultState = markAsTouched(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = markAsTouched(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(markAsUntouched.name, () => {
    it('should call reducer for controls', () => {
      const state = { ...INITIAL_STATE.controls.inner, isTouched: false, isUntouched: true };
      const resultState = markAsUntouched(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const state = { ...INITIAL_STATE, isTouched: false, isUntouched: true };
      const resultState = markAsUntouched(state);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(markAsSubmitted.name, () => {
    it('should call reducer for controls', () => {
      const resultState = markAsSubmitted(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = markAsSubmitted(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(markAsUnsubmitted.name, () => {
    it('should call reducer for controls', () => {
      const state = { ...INITIAL_STATE.controls.inner, isSubmitted: false, isUnsubmitted: true };
      const resultState = markAsUnsubmitted(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const state = { ...INITIAL_STATE, isSubmitted: false, isUnsubmitted: true };
      const resultState = markAsUnsubmitted(state);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(focus.name, () => {
    it('should call reducer for controls', () => {
      const resultState = focus(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });
  });

  describe(unfocus.name, () => {
    it('should call reducer for controls', () => {
      const state = { ...INITIAL_STATE.controls.inner, isSubmitted: false, isUnsubmitted: true };
      const resultState = unfocus(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });
  });

  describe(setLastKeyDownCode.name, () => {
    it('should call reducer for controls', () => {
      const resultState = setLastKeyDownCode(12)(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });
  });

  describe(addControl.name, () => {
    it('should call reducer for groups', () => {
      const resultState = addControl<FormGroupValue, 'inner2'>('inner2', 'A')(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });

  describe(removeControl.name, () => {
    it('should call reducer for groups', () => {
      const resultState = removeControl<FormGroupValue>('inner3')(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });
  });
});
