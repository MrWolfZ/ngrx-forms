import { ActionReducer } from '@ngrx/store';

import { FormControlState, createFormControlState, FormGroupState, createFormGroupState } from './state';
import {
  Actions,
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
} from './actions';
import { createFormControlReducer, createFormGroupReducer } from './reducer';

describe('ngrx-forms:', () => {
  describe('form control reducer', () => {
    const FORM_CONTROL_ID = 'test ID';
    const INITIAL_FORM_CONTROL_VALUE = '';
    const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

    let reducer: ActionReducer<FormControlState<string>>;

    beforeEach(() => {
      reducer = createFormControlReducer<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
    });

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
  });

  describe('form group reducer', () => {
    const FORM_CONTROL_ID = 'test ID';
    const FORM_CONTROL_INNER_ID = 'test ID.inner';
    const FORM_CONTROL_INNER2_ID = 'test ID.inner2';
    const FORM_CONTROL_INNER3_ID = 'test ID.inner3';
    const FORM_CONTROL_INNER4_ID = 'test ID.inner3.inner4';
    interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
    const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
    const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
    const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
    const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

    let reducer: ActionReducer<FormGroupState<FormGroupValue>>;
    let reducerFull: ActionReducer<FormGroupState<FormGroupValue>>;

    beforeEach(() => {
      reducer = createFormGroupReducer(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
      reducerFull = createFormGroupReducer(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);
    });

    it('should skip any action with non-equal control ID', () => {
      const resultState = reducer(INITIAL_STATE, new SetValueAction('A' + FORM_CONTROL_ID, 'A'));
      expect(resultState).toBe(INITIAL_STATE);
    });

    it('should forward actions to children', () => {
      const value = 'A';
      const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value));
      expect(resultState.controls.inner.value).toEqual(value);
    });

    it('should not update state if no child was updated', () => {
      const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, ''));
      expect(resultState).toBe(INITIAL_STATE);
    });

    it('should not update state value if no child value was updated', () => {
      const resultState = reducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
      expect(resultState.value).toBe(INITIAL_STATE.value);
    });

    describe(SetValueAction.name, () => {
      it('should update state value if different', () => {
        const value = { inner: 'A' };
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
        expect(resultState.value).toEqual(value);
      });

      it('should not update state value if same', () => {
        const value = { inner: 'A' };
        const state = { ...INITIAL_STATE, value };
        const resultState = reducer(state, new SetValueAction(FORM_CONTROL_ID, value));
        expect(resultState).toBe(state);
      });

      it('should mark state as dirty if value is different', () => {
        const value = { inner: 'A' };
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
        expect(resultState.isDirty).toEqual(true);
      });

      it('should update child state value', () => {
        const value = { inner: 'A' };
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
        expect(resultState.controls.inner.value).toEqual(value.inner);
      });

      it('should create child states on demand', () => {
        const value = { inner: 'A', inner2: 'B' };
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
        expect(resultState.value).toEqual(value);
        expect(resultState.controls.inner2.value).toEqual(value.inner2);
      });

      it('should create child states on demand for group children', () => {
        const value = { inner: 'A', inner3: { inner4: 'C' } };
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
        expect(resultState.value).toEqual(value);
        expect(resultState.controls.inner3.value).toEqual(value.inner3);
      });

      it('should remove child states on demand', () => {
        const value = { inner: 'A', inner2: 'B' };
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
        const value2 = { inner: 'A' };
        resultState = reducer(resultState, new SetValueAction(FORM_CONTROL_ID, value2));
        expect(resultState.value).toEqual(value2);
        expect(resultState.controls.inner2).toBeUndefined();
      });

      it('should aggregate child values', () => {
        const value = 'A';
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value));
        expect(resultState.value).toEqual({ inner: 'A' });
      });

      it('should mark state as dirty if child value is updated', () => {
        const value = 'A';
        const resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value));
        expect(resultState.isDirty).toEqual(true);
        expect(resultState.controls.inner.isDirty).toEqual(true);
      });

      it('should aggregate child values for group children', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const value = { inner4: 'D' };
        resultState = reducer(resultState, new SetValueAction(FORM_CONTROL_INNER3_ID, value));
        expect(resultState.value.inner3).toEqual(value);
      });

      it('should mark state as dirty if group child value is updated', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const value = { inner4: 'D' };
        resultState = reducer(resultState, new SetValueAction(FORM_CONTROL_INNER3_ID, value));
        expect(resultState.isDirty).toEqual(true);
        expect(resultState.controls.inner3.isDirty).toEqual(true);
      });

      it('should aggregate nested child values', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const value = 'D';
        resultState = reducer(resultState, new SetValueAction(FORM_CONTROL_INNER4_ID, value));
        expect(resultState.value.inner3!.inner4).toEqual(value);
      });

      it('should mark state as dirty if nested child value is updated', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const value = 'D';
        resultState = reducer(resultState, new SetValueAction(FORM_CONTROL_INNER4_ID, value));
        expect(resultState.isDirty).toEqual(true);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDirty).toEqual(true);
      });
    });

    describe(SetErrorsAction.name, () => {
      it('should update state if there are errors', () => {
        const errors = { required: true };
        const resultState = reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, errors));
        expect(resultState.errors).toEqual(errors);
        expect(resultState.isValid).toBe(false);
        expect(resultState.isInvalid).toBe(true);
      });

      it('should update state if there are no errors', () => {
        const errors = { required: true };
        const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
        const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_ID, {}));
        expect(resultState.errors).toEqual({});
        expect(resultState.isValid).toBe(true);
        expect(resultState.isInvalid).toBe(false);
      });

      it('should not update state if errors are same', () => {
        const errors = { required: true };
        const state = { ...INITIAL_STATE, isValid: false, isInvalid: true, errors };
        const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors));
        expect(resultState).toBe(state);
      });

      it('should aggregate child errors', () => {
        const errors = { required: true };
        const resultState = reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_INNER_ID, errors));
        expect(resultState.errors).toEqual({ _inner: errors });
        expect(resultState.isValid).toEqual(false);
        expect(resultState.isInvalid).toEqual(true);
      });

      it('should aggregate child errors for group children', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const errors = { required: true };
        resultState = reducer(resultState, new SetErrorsAction(FORM_CONTROL_INNER3_ID, errors));
        expect(resultState.errors).toEqual({ _inner3: errors });
        expect(resultState.isValid).toEqual(false);
        expect(resultState.isInvalid).toEqual(true);
      });

      it('should aggregate nested child errors', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const errors = { required: true };
        resultState = reducer(resultState, new SetErrorsAction(FORM_CONTROL_INNER4_ID, errors));
        expect(resultState.errors).toEqual({ _inner3: { _inner4: errors } });
        expect(resultState.isValid).toEqual(false);
        expect(resultState.isInvalid).toEqual(true);
      });

      it('should aggregate multiple child errors', () => {
        let resultState = reducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }));
        const errors1 = { required: true };
        const errors2 = { min: 0 };
        resultState = reducer(resultState, new SetErrorsAction(FORM_CONTROL_INNER_ID, errors1));
        resultState = reducer(resultState, new SetErrorsAction(FORM_CONTROL_INNER3_ID, errors2));
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
            }
          }
        };
        const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_ID, errors1));
        expect(resultState.errors).toEqual({ ...errors1, _inner: errors2 });
      });

      it('should track own errors and child errors when child errors are changed', () => {
        const errors1 = { required: true };
        const state = {
          ...INITIAL_STATE,
          isValid: false,
          isInvalid: true,
          errors: errors1
        };
        const errors2 = { min: 0 };
        const resultState = reducer(state, new SetErrorsAction(FORM_CONTROL_INNER_ID, errors2));
        expect(resultState.errors).toEqual({ ...errors1, _inner: errors2 });
      });

      it('should throw if trying to set invalid error value', () => {
        expect(() => reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, null as any))).toThrowError();
        expect(() => reducer(INITIAL_STATE, new SetErrorsAction(FORM_CONTROL_ID, { _inner: true }))).toThrowError();
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

      it('should mark direct control children as dirty', () => {
        const resultState = reducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner.isDirty).toEqual(true);
        expect(resultState.controls.inner.isPristine).toEqual(false);
      });

      it('should mark direct group children as dirty', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner3.isDirty).toEqual(true);
        expect(resultState.controls.inner3.isPristine).toEqual(false);
      });

      it('should mark nested children as dirty', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDirty).toBe(true);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isPristine).toBe(false);
      });

      it('should mark state as dirty if direct control child is marked as dirty', () => {
        const resultState = reducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isDirty).toEqual(true);
        expect(resultState.isPristine).toEqual(false);
      });

      it('should mark state as dirty if direct group child is marked as dirty', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER3_ID));
        expect(resultState.isDirty).toEqual(true);
        expect(resultState.isPristine).toEqual(false);
      });

      it('should mark state as dirty if nested child is marked as dirty', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isDirty).toEqual(true);
        expect(resultState.isPristine).toEqual(false);
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

      it('should mark direct control children as pristine', () => {
        const state = {
          ...INITIAL_STATE,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE.controls,
            inner: {
              ...INITIAL_STATE.controls.inner,
              isDirty: true,
              isPristine: false,
            },
          },
        };
        const resultState = reducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner.isDirty).toEqual(false);
        expect(resultState.controls.inner.isPristine).toEqual(true);
      });

      it('should mark direct group children as pristine', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isDirty: true,
              isPristine: false,
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsPristineAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner3.isDirty).toEqual(false);
        expect(resultState.controls.inner3.isPristine).toEqual(true);
      });

      it('should mark nested children as pristine', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...inner3State,
              isDirty: true,
              isPristine: false,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isDirty: true,
                  isPristine: false,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsPristineAction(FORM_CONTROL_ID));
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDirty).toBe(false);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isPristine).toBe(true);
      });

      it('should mark state as pristine if all children are pristine when direct control child is updated', () => {
        const state = {
          ...INITIAL_STATE,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE.controls,
            inner: {
              ...INITIAL_STATE.controls.inner,
              isDirty: true,
              isPristine: false,
            },
          },
        };
        const resultState = reducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isDirty).toEqual(false);
        expect(resultState.isPristine).toEqual(true);
      });

      it('should not mark state as pristine if not all children are pristine when direct control child is updated', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isDirty: true,
              isPristine: false,
            },
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isDirty: true,
              isPristine: false,
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isDirty).toEqual(true);
        expect(resultState.isPristine).toEqual(false);
      });

      it('should mark state as pristine if all children are pristine when direct group child is updated', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isDirty: true,
              isPristine: false,
            },
          },
        };
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsPristineAction(FORM_CONTROL_INNER3_ID));
        expect(resultState.isDirty).toEqual(false);
        expect(resultState.isPristine).toEqual(true);
      });

      it('should mark state as pristine if all children are pristine when nested child is updated', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isDirty: true,
          isPristine: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...inner3State,
              isDirty: true,
              isPristine: false,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isDirty: true,
                  isPristine: false,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsPristineAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isDirty).toEqual(false);
        expect(resultState.isPristine).toEqual(true);
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

      it('should enable direct control children', () => {
        const state = {
          ...INITIAL_STATE,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...INITIAL_STATE.controls,
            inner: {
              ...INITIAL_STATE.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
          },
        };
        const resultState = reducer(state, new EnableAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner.isEnabled).toBe(true);
        expect(resultState.controls.inner.isDisabled).toBe(false);
      });

      it('should enable direct group children', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isEnabled: false,
              isDisabled: true,
            },
          },
        };
        const resultState = reducerFull(state, new EnableAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner3.isEnabled).toBe(true);
        expect(resultState.controls.inner3.isDisabled).toBe(false);
      });

      it('should enable nested children', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
            inner3: {
              ...inner3State,
              isEnabled: false,
              isDisabled: true,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isEnabled: false,
                  isDisabled: true,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new EnableAction(FORM_CONTROL_ID));
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isEnabled).toBe(true);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDisabled).toBe(false);
      });

      it('should enable if direct control child gets enabled', () => {
        const state = {
          ...INITIAL_STATE,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...INITIAL_STATE.controls,
            inner: {
              ...INITIAL_STATE.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
          },
        };
        const resultState = reducer(state, new EnableAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isEnabled).toBe(true);
        expect(resultState.isDisabled).toBe(false);
      });

      it('should enable without enabling any other children if direct group child gets enabled', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isEnabled: false,
              isDisabled: true,
            },
          },
        };
        const resultState = reducerFull(state, new EnableAction(FORM_CONTROL_INNER3_ID));
        expect(resultState.isEnabled).toBe(true);
        expect(resultState.isDisabled).toBe(false);
        expect(resultState.controls.inner.isEnabled).toBe(false);
        expect(resultState.controls.inner.isDisabled).toBe(true);
      });

      it('should enable without enabling any other children if nested child gets enabled', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isEnabled: false,
          isDisabled: true,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
            inner3: {
              ...inner3State,
              isEnabled: false,
              isDisabled: true,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isEnabled: false,
                  isDisabled: true,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new EnableAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isEnabled).toBe(true);
        expect(resultState.isDisabled).toBe(false);
        expect(resultState.controls.inner.isEnabled).toBe(false);
        expect(resultState.controls.inner.isDisabled).toBe(true);
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

      it('should disable direct control children', () => {
        const resultState = reducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner.isEnabled).toBe(false);
        expect(resultState.controls.inner.isDisabled).toBe(true);
      });

      it('should disable direct group children', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner3.isEnabled).toBe(false);
        expect(resultState.controls.inner3.isDisabled).toBe(true);
      });

      it('should disable nested children', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_ID));
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isEnabled).toBe(false);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDisabled).toBe(true);
      });

      it('should disable if all children are disabled when direct control child is disabled', () => {
        const resultState = reducer(INITIAL_STATE, new DisableAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isEnabled).toBe(false);
        expect(resultState.isDisabled).toBe(true);
      });

      it('should not disable if not all children are disabled when direct control child is disabled', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isEnabled).toBe(true);
        expect(resultState.isDisabled).toBe(false);
      });

      it('should disable if all children are disabled when direct group child is disabled', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
            inner2: {
              ...INITIAL_STATE_FULL.controls.inner2,
              isEnabled: false,
              isDisabled: true,
            },
          },
        };
        const resultState = reducerFull(state, new DisableAction(FORM_CONTROL_INNER3_ID));
        expect(resultState.isEnabled).toBe(false);
        expect(resultState.isDisabled).toBe(true);
      });

      it('should disable if all children are disabled when nested child is disabled', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isEnabled: false,
              isDisabled: true,
            },
            inner2: {
              ...INITIAL_STATE_FULL.controls.inner2,
              isEnabled: false,
              isDisabled: true,
            },
          },
        };
        const resultState = reducerFull(state, new DisableAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isEnabled).toBe(false);
        expect(resultState.isDisabled).toBe(true);
      });

      it('should not disable if not all children are disabled when nested child is disabled', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new DisableAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isEnabled).toBe(true);
        expect(resultState.isDisabled).toBe(false);
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

      it('should mark direct control children as touched', () => {
        const resultState = reducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner.isTouched).toEqual(true);
        expect(resultState.controls.inner.isUntouched).toEqual(false);
      });

      it('should mark direct group children as touched', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner3.isTouched).toEqual(true);
        expect(resultState.controls.inner3.isUntouched).toEqual(false);
      });

      it('should mark nested children as touched', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isTouched).toBe(true);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isUntouched).toBe(false);
      });

      it('should mark state as touched if direct control child is marked as touched', () => {
        const resultState = reducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isTouched).toEqual(true);
        expect(resultState.isUntouched).toEqual(false);
      });

      it('should mark state as touched if direct group child is marked as touched', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_INNER3_ID));
        expect(resultState.isTouched).toEqual(true);
        expect(resultState.isUntouched).toEqual(false);
      });

      it('should mark state as touched if nested child is marked as touched', () => {
        const resultState = reducerFull(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isTouched).toEqual(true);
        expect(resultState.isUntouched).toEqual(false);
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

      it('should mark direct control children as untouched', () => {
        const state = {
          ...INITIAL_STATE,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE.controls,
            inner: {
              ...INITIAL_STATE.controls.inner,
              isTouched: true,
              isUntouched: false,
            },
          },
        };
        const resultState = reducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner.isTouched).toEqual(false);
        expect(resultState.controls.inner.isUntouched).toEqual(true);
      });

      it('should mark direct group children as untouched', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isTouched: true,
              isUntouched: false,
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
        expect(resultState.controls.inner3.isTouched).toEqual(false);
        expect(resultState.controls.inner3.isUntouched).toEqual(true);
      });

      it('should mark nested children as untouched', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...inner3State,
              isTouched: true,
              isUntouched: false,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isTouched: true,
                  isUntouched: false,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isTouched).toBe(false);
        expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isUntouched).toBe(true);
      });

      it('should mark state as untouched if all children are untouched when direct control child is updated', () => {
        const state = {
          ...INITIAL_STATE,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE.controls,
            inner: {
              ...INITIAL_STATE.controls.inner,
              isTouched: true,
              isUntouched: false,
            },
          },
        };
        const resultState = reducer(INITIAL_STATE, new MarkAsUntouchedAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isTouched).toEqual(false);
        expect(resultState.isUntouched).toEqual(true);
      });

      it('should not mark state as untouched if not all children are untouched when direct control child is updated', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner: {
              ...INITIAL_STATE_FULL.controls.inner,
              isTouched: true,
              isUntouched: false,
            },
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isTouched: true,
              isUntouched: false,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isTouched: true,
                  isUntouched: false,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER_ID));
        expect(resultState.isTouched).toEqual(true);
        expect(resultState.isUntouched).toEqual(false);
      });

      it('should mark state as untouched if all children are untouched when direct group child is updated', () => {
        const state = {
          ...INITIAL_STATE_FULL,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...INITIAL_STATE_FULL.controls.inner3,
              isTouched: true,
              isUntouched: false,
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER3_ID));
        expect(resultState.isTouched).toEqual(false);
        expect(resultState.isUntouched).toEqual(true);
      });

      it('should mark state as untouched if all children are untouched when nested child is updated', () => {
        const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
        const state = {
          ...INITIAL_STATE_FULL,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...INITIAL_STATE_FULL.controls,
            inner3: {
              ...inner3State,
              isTouched: true,
              isUntouched: false,
              controls: {
                ...inner3State.controls,
                inner4: {
                  ...inner3State.controls.inner4,
                  isTouched: true,
                  isUntouched: false,
                },
              },
            },
          },
        };
        const resultState = reducerFull(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER4_ID));
        expect(resultState.isTouched).toEqual(false);
        expect(resultState.isUntouched).toEqual(true);
      });
    });
  });
});
