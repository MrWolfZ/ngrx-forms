import { MarkAsTouchedAction, SetValueAction } from './actions';
import { cast, createFormGroupState, FormGroupState } from './state';
import {
  addControl,
  disable,
  enable,
  focus,
  groupUpdateReducer,
  markAsDirty,
  markAsPristine,
  markAsSubmitted,
  markAsTouched,
  markAsUnsubmitted,
  markAsUntouched,
  removeControl,
  setUserDefinedProperty,
  setValue,
  unfocus,
  updateGroup,
  validate,
} from './update-functions';

describe('update functions', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  interface NestedValue { inner4: string; }
  interface FormGroupValue { inner: string; inner2?: string; inner3?: NestedValue; inner5: string[]; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '', inner3: { inner4: '' }, inner5: [''] };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  describe(updateGroup.name, () => {
    it('should apply the provided functions to control children', () => {
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

    it('should apply multiple provided function objects one after another', () => {
      const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
      const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
      const expectedInner3 = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
      const resultState = updateGroup<FormGroupValue>({
        inner: () => updatedInner1,
        inner3: () => expectedInner3,
      }, {
          inner: () => expectedInner1,
        })(INITIAL_STATE);
      expect(resultState.controls.inner).toBe(expectedInner1);
      expect(resultState.controls.inner3).toBe(expectedInner3);
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
    it('should apply the action and the provided functions to control children', () => {
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

    it('should apply multiple provided function objects one after another', () => {
      const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
      const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
      const expectedInner3 = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
      const resultState = groupUpdateReducer<FormGroupValue>({
        inner: () => updatedInner1,
        inner3: () => expectedInner3,
      }, {
          inner: () => expectedInner1,
        })(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, 'D'));
      expect(resultState.controls.inner).toBe(expectedInner1);
      expect(resultState.controls.inner3).toBe(expectedInner3);
    });
  });

  describe(setValue.name, () => {
    it('should call reducer for controls', () => {
      const resultState = setValue<string>('A')(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = setValue<FormGroupValue>({ inner: 'A', inner5: INITIAL_STATE.value.inner5 })(INITIAL_STATE);
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });

    it('should call reducer for arrays', () => {
      const resultState = setValue<string[]>(['A'])(INITIAL_STATE.controls.inner5);
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
    });

    it('should call reducer for controls uncurried', () => {
      const resultState = setValue('A', INITIAL_STATE.controls.inner);
      expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
    });

    it('should call reducer for groups uncurried', () => {
      const resultState = setValue({ inner: 'A', inner5: INITIAL_STATE.value.inner5 }, INITIAL_STATE);
      expect(resultState).not.toBe(INITIAL_STATE);
    });

    it('should call reducer for arrays uncurried', () => {
      const resultState = setValue(['A'], INITIAL_STATE.controls.inner5);
      expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
    });

    it('should throw if curried and no state', () => {
      expect(() => setValue<string>('')(undefined as any)).toThrowError();
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

    it('should call reducer for arrays', () => {
      const errors = { required: true };
      const resultState = validate<string[]>(() => errors)(INITIAL_STATE.controls.inner5);
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
    });

    it('should call reducer for controls uncurried', () => {
      const errors = { required: true };
      const resultState = validate(() => errors, INITIAL_STATE.controls.inner);
      expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
    });

    it('should call reducer for groups uncurried', () => {
      const errors = { required: true };
      const resultState = validate(() => errors, INITIAL_STATE);
      expect(resultState).not.toBe(INITIAL_STATE);
    });

    it('should call reducer for arrays uncurried', () => {
      const errors = { required: true };
      const resultState = validate(() => errors, INITIAL_STATE.controls.inner5);
      expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
    });

    it('should merge errors from multiple validation functions', () => {
      const errors1 = { required: true };
      const errors2 = { min: 1 };
      const mergedErrors = { required: true, min: 1 };
      const resultState = validate<string>([() => errors1, () => errors2])(cast(INITIAL_STATE.controls.inner));
      expect(resultState.errors).toEqual(mergedErrors);
    });

    it('should merge errors from multiple validation functions in the order they were provided', () => {
      const errors1 = { min: 1, required: true };
      const errors2 = { min: 2 };
      const mergedErrors = { required: true, min: 2 };
      const resultState = validate<string>([() => errors1, () => errors2])(cast(INITIAL_STATE.controls.inner));
      expect(resultState.errors).toEqual(mergedErrors);
    });

    it('should throw if curried and no state', () => {
      const errors = { required: true };
      expect(() => validate<string>(() => errors)(undefined as any)).toThrowError();
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

    it('should call reducer for arrays', () => {
      const state = { ...INITIAL_STATE.controls.inner5, isEnabled: false, isDisabled: true };
      const resultState = enable(state);
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const resultState = disable(cast(INITIAL_STATE.controls.inner5));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const resultState = markAsDirty(cast(INITIAL_STATE.controls.inner5));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const state = { ...INITIAL_STATE.controls.inner5, isDirty: false, isPristine: true };
      const resultState = markAsPristine(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const resultState = markAsTouched(cast(INITIAL_STATE.controls.inner5));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const state = { ...INITIAL_STATE.controls.inner5, isTouched: false, isUntouched: true };
      const resultState = markAsUntouched(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const resultState = markAsSubmitted(cast(INITIAL_STATE.controls.inner5));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

    it('should call reducer for arrays', () => {
      const state = { ...INITIAL_STATE.controls.inner5, isSubmitted: false, isUnsubmitted: true };
      const resultState = markAsUnsubmitted(cast(state));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
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

  describe(setUserDefinedProperty.name, () => {
    it('should call reducer for controls', () => {
      const resultState = setUserDefinedProperty('prop', 12)(cast(INITIAL_STATE.controls.inner));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner));
    });

    it('should call reducer for groups', () => {
      const resultState = setUserDefinedProperty('prop', 12)(cast(INITIAL_STATE));
      expect(resultState).not.toBe(cast(INITIAL_STATE));
    });

    it('should call reducer for arrays', () => {
      const resultState = setUserDefinedProperty('prop', 12)(cast(INITIAL_STATE.controls.inner5));
      expect(resultState).not.toBe(cast(INITIAL_STATE.controls.inner5));
    });
  });
});
