import { SetValueAction, MarkAsTouchedAction } from './actions';
import { FormGroupState, createFormGroupState } from './state';
import {
  updateGroup,
  groupUpdateReducer,
  validate,
} from './update-functions';

describe('update functions', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  interface NestedValue { inner4: string; }
  interface FormGroupValue { inner: string; inner2?: string; inner3?: NestedValue; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
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

  describe(validate.name, () => {
    it('should set errors for controls', () => {
      const errors = { required: true };
      const resultState = validate<string>(() => errors)(INITIAL_STATE.controls.inner);
      expect(resultState.errors).toBe(errors);
    });

    it('should set errors for groups', () => {
      const errors = { required: true };
      const resultState = validate<FormGroupValue>(() => errors)(INITIAL_STATE);
      expect(resultState.errors).toEqual(errors);
    });
  });
});
