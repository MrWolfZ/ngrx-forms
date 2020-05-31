import { FORM_CONTROL_0_ID, FORM_CONTROL_1_ID } from './array/reducer/test-util';
import { box } from './boxing';
import { FORM_CONTROL_INNER2_ID, FORM_CONTROL_INNER_ID } from './group/reducer/test-util';
import {
  computeArrayState,
  computeGroupState,
  createChildState,
  createFormArrayState,
  createFormControlState,
  createFormGroupState,
  isArrayState,
  isGroupState,
  verifyFormControlValueIsValid,
} from './state';

describe('state', () => {
  const FORM_CONTROL_ID = 'test ID';

  describe('control', () => {
    const INITIAL_FORM_CONTROL_VALUE = 'abc';
    const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

    it('should set the correct id', () => {
      expect(INITIAL_STATE.id).toBe(FORM_CONTROL_ID);
    });

    it('should set the correct value', () => {
      expect(INITIAL_STATE.value).toBe(INITIAL_FORM_CONTROL_VALUE);
    });

    it('should mark control as valid', () => {
      expect(INITIAL_STATE.isValid).toBe(true);
      expect(INITIAL_STATE.isInvalid).toBe(false);
    });

    it('should mark control as enabled', () => {
      expect(INITIAL_STATE.isEnabled).toBe(true);
      expect(INITIAL_STATE.isDisabled).toBe(false);
    });

    it('should mark control as unfocused', () => {
      expect(INITIAL_STATE.isFocused).toBe(false);
      expect(INITIAL_STATE.isUnfocused).toBe(true);
    });

    it('should set empty errors', () => {
      expect(INITIAL_STATE.errors).toEqual({});
    });

    it('should mark control as pristine', () => {
      expect(INITIAL_STATE.isPristine).toBe(true);
      expect(INITIAL_STATE.isDirty).toBe(false);
    });

    it('should mark control as untouched', () => {
      expect(INITIAL_STATE.isTouched).toBe(false);
      expect(INITIAL_STATE.isUntouched).toBe(true);
    });

    it('should mark control as unsubmitted', () => {
      expect(INITIAL_STATE.isSubmitted).toBe(false);
      expect(INITIAL_STATE.isUnsubmitted).toBe(true);
    });

    it('should set empty user-defined properties', () => {
      expect(INITIAL_STATE.userDefinedProperties).toEqual({});
    });

    it('should create a form control state for a boxed value', () => {
      const value = box({ inner: 'A' });
      const state = createFormControlState('ID', value);
      expect(state.value).toEqual(value);
    });

    it('createFormControlState should throw for non-serializable values', () => {
      expect(() => createFormControlState('', (() => void 0) as any)).toThrowError();
    });

    it('createFormControlState should throw for non-serializable boxed values', () => {
      expect(() => createFormControlState('', box({ f: () => void 0 }))).toThrowError();
    });
  });

  describe('group', () => {
    const CONTROL_VALUE = 'abc';
    const GROUP_VALUE = { control: 'bcd' };
    const ARRAY_VALUE = ['def'];
    const INITIAL_VALUE = { control: CONTROL_VALUE, group: GROUP_VALUE, array: ARRAY_VALUE };
    const INITIAL_STATE = createFormGroupState<typeof INITIAL_VALUE>(FORM_CONTROL_ID, INITIAL_VALUE);

    it('should set the correct id', () => {
      expect(INITIAL_STATE.id).toBe(FORM_CONTROL_ID);
    });

    it('should set the correct value', () => {
      expect(INITIAL_STATE.value).toBe(INITIAL_VALUE);
    });

    it('should mark control as valid', () => {
      expect(INITIAL_STATE.isValid).toBe(true);
      expect(INITIAL_STATE.isInvalid).toBe(false);
    });

    it('should mark control as enabled', () => {
      expect(INITIAL_STATE.isEnabled).toBe(true);
      expect(INITIAL_STATE.isDisabled).toBe(false);
    });

    it('should set empty errors', () => {
      expect(INITIAL_STATE.errors).toEqual({});
    });

    it('should mark control as pristine', () => {
      expect(INITIAL_STATE.isPristine).toBe(true);
      expect(INITIAL_STATE.isDirty).toBe(false);
    });

    it('should mark control as untouched', () => {
      expect(INITIAL_STATE.isTouched).toBe(false);
      expect(INITIAL_STATE.isUntouched).toBe(true);
    });

    it('should mark control as unsubmitted', () => {
      expect(INITIAL_STATE.isSubmitted).toBe(false);
      expect(INITIAL_STATE.isUnsubmitted).toBe(true);
    });

    it('should set empty user-defined properties', () => {
      expect(INITIAL_STATE.userDefinedProperties).toEqual({});
    });

    it('should create control child', () => {
      expect(INITIAL_STATE.controls.control.value).toEqual(CONTROL_VALUE);
      expect(INITIAL_STATE.controls.control.isFocused).toBeDefined();
    });

    it('should create group child', () => {
      expect(INITIAL_STATE.controls.group.value).toEqual(GROUP_VALUE);
      const controls = INITIAL_STATE.controls.group.controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(false);
    });

    it('should create array child', () => {
      expect(INITIAL_STATE.controls.array.value).toEqual(ARRAY_VALUE);
      const controls = INITIAL_STATE.controls.array.controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(true);
    });

    it('should produce the same state as is computed after an action is applied', () => {
      const state = computeGroupState(
        INITIAL_STATE.id,
        INITIAL_STATE.controls,
        INITIAL_STATE.value,
        INITIAL_STATE.errors,
        INITIAL_STATE.pendingValidations,
        INITIAL_STATE.userDefinedProperties,
        {
          wasOrShouldBeEnabled: true,
        },
      );

      expect(state.id).toBe(INITIAL_STATE.id);
      expect(state.value).toEqual(INITIAL_STATE.value);
      expect(state.errors).toEqual(INITIAL_STATE.errors);
      expect(state.pendingValidations).toEqual(INITIAL_STATE.pendingValidations);
      expect(state.isValid).toEqual(INITIAL_STATE.isValid);
      expect(state.isInvalid).toEqual(INITIAL_STATE.isInvalid);
      expect(state.isEnabled).toEqual(INITIAL_STATE.isEnabled);
      expect(state.isDisabled).toEqual(INITIAL_STATE.isDisabled);
      expect(state.isDirty).toEqual(INITIAL_STATE.isDirty);
      expect(state.isPristine).toEqual(INITIAL_STATE.isPristine);
      expect(state.isTouched).toEqual(INITIAL_STATE.isTouched);
      expect(state.isUntouched).toEqual(INITIAL_STATE.isUntouched);
      expect(state.isSubmitted).toEqual(INITIAL_STATE.isSubmitted);
      expect(state.isUnsubmitted).toEqual(INITIAL_STATE.isUnsubmitted);
      expect(state.userDefinedProperties).toEqual(INITIAL_STATE.userDefinedProperties);
    });

    it('should produce the same state as is computed after an action is applied for empty group', () => {
      const initialState = createFormGroupState(FORM_CONTROL_ID, {});
      const state = computeGroupState(
        initialState.id,
        initialState.controls,
        initialState.value,
        initialState.errors,
        initialState.pendingValidations,
        initialState.userDefinedProperties,
        {
          wasOrShouldBeEnabled: true,
        },
      );

      expect(state.id).toBe(initialState.id);
      expect(state.value).toEqual(initialState.value);
      expect(state.errors).toEqual(initialState.errors);
      expect(state.pendingValidations).toEqual(initialState.pendingValidations);
      expect(state.isValid).toEqual(initialState.isValid);
      expect(state.isInvalid).toEqual(initialState.isInvalid);
      expect(state.isEnabled).toEqual(initialState.isEnabled);
      expect(state.isDisabled).toEqual(initialState.isDisabled);
      expect(state.isDirty).toEqual(initialState.isDirty);
      expect(state.isPristine).toEqual(initialState.isPristine);
      expect(state.isTouched).toEqual(initialState.isTouched);
      expect(state.isUntouched).toEqual(initialState.isUntouched);
      expect(state.isSubmitted).toEqual(initialState.isSubmitted);
      expect(state.isUnsubmitted).toEqual(initialState.isUnsubmitted);
      expect(state.userDefinedProperties).toEqual(initialState.userDefinedProperties);
    });

    it('should create the correct state shape for nested boxed values', () => {
      const value = {
        s: 'A',
        object: {
          inner: 'A',
        },
        array: ['A'],
        boxedObject: box({
          inner: 'A',
        }),
        boxedArray: box(['A']),
      };

      const state = createFormGroupState(FORM_CONTROL_ID, value);
      expect(state.controls.s.isFocused).toBeDefined();
      expect(state.controls.boxedObject.isFocused).toBeDefined();
      expect(state.controls.boxedArray.isFocused).toBeDefined();
      expect(state.controls.object.controls).toBeDefined();
      expect(Array.isArray(state.controls.object.controls)).toBe(false);
      expect(state.controls.array.controls).toBeDefined();
      expect(Array.isArray(state.controls.array.controls)).toBe(true);
    });
  });

  describe('array', () => {
    const INITIAL_VALUE = ['a', 'b'];
    const INITIAL_STATE = createFormArrayState<string>(FORM_CONTROL_ID, INITIAL_VALUE);

    it('should set the correct id', () => {
      expect(INITIAL_STATE.id).toBe(FORM_CONTROL_ID);
    });

    it('should set the correct value', () => {
      expect(INITIAL_STATE.value).toBe(INITIAL_VALUE);
    });

    it('should set the correct value for empty arrays', () => {
      expect(createFormArrayState<string>(FORM_CONTROL_ID, []).value).toEqual([]);
    });

    it('should mark control as valid', () => {
      expect(INITIAL_STATE.isValid).toBe(true);
      expect(INITIAL_STATE.isInvalid).toBe(false);
    });

    it('should mark control as enabled', () => {
      expect(INITIAL_STATE.isEnabled).toBe(true);
      expect(INITIAL_STATE.isDisabled).toBe(false);
    });

    it('should set empty errors', () => {
      expect(INITIAL_STATE.errors).toEqual({});
    });

    it('should mark control as pristine', () => {
      expect(INITIAL_STATE.isPristine).toBe(true);
      expect(INITIAL_STATE.isDirty).toBe(false);
    });

    it('should mark control as untouched', () => {
      expect(INITIAL_STATE.isTouched).toBe(false);
      expect(INITIAL_STATE.isUntouched).toBe(true);
    });

    it('should mark control as unsubmitted', () => {
      expect(INITIAL_STATE.isSubmitted).toBe(false);
      expect(INITIAL_STATE.isUnsubmitted).toBe(true);
    });

    it('should set empty user-defined properties', () => {
      expect(INITIAL_STATE.userDefinedProperties).toEqual({});
    });

    it('should create control child', () => {
      expect(INITIAL_STATE.controls[0].value).toEqual(INITIAL_VALUE[0]);
      expect(INITIAL_STATE.controls[0].isFocused).toBeDefined();
    });

    it('should create group child', () => {
      const initialValue = [{ control: 'a' }, { control: 'b' }];
      const initialState = createFormArrayState<{ control: string }>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls[0].value).toEqual(initialValue[0]);
      const controls = initialState.controls[0].controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(false);
    });

    it('should create array child', () => {
      const initialValue = [['a'], ['b']];
      const initialState = createFormArrayState<string[]>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls[0].value).toEqual(initialValue[0]);
      const controls = initialState.controls[0].controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(true);
    });

    it('should create mixed children', () => {
      const initialValue = [['a'], { control: 'b' }];
      const initialState = createFormArrayState<string[] | { control: string }>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls[0].value).toEqual(initialValue[0]);
      const controls = initialState.controls[0].controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(true);
      expect(initialState.controls[1].value).toEqual(initialValue[1]);
      const controls2 = initialState.controls[1].controls;
      expect(controls2).toBeDefined();
      expect(Array.isArray(controls2)).toBe(false);
    });

    it('should create empty children array for empty value array', () => {
      const initialValue = [] as string[];
      const initialState = createFormArrayState<string>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls).toEqual([]);
    });

    it('should produce the same state as is computed after an action is applied', () => {
      const state = computeArrayState(
        INITIAL_STATE.id,
        INITIAL_STATE.controls,
        INITIAL_STATE.value,
        INITIAL_STATE.errors,
        INITIAL_STATE.pendingValidations,
        INITIAL_STATE.userDefinedProperties,
        {
          wasOrShouldBeEnabled: true,
        },
      );

      expect(state.id).toBe(INITIAL_STATE.id);
      expect(state.value).toEqual(INITIAL_STATE.value);
      expect(state.errors).toEqual(INITIAL_STATE.errors);
      expect(state.pendingValidations).toEqual(INITIAL_STATE.pendingValidations);
      expect(state.isValid).toEqual(INITIAL_STATE.isValid);
      expect(state.isInvalid).toEqual(INITIAL_STATE.isInvalid);
      expect(state.isEnabled).toEqual(INITIAL_STATE.isEnabled);
      expect(state.isDisabled).toEqual(INITIAL_STATE.isDisabled);
      expect(state.isDirty).toEqual(INITIAL_STATE.isDirty);
      expect(state.isPristine).toEqual(INITIAL_STATE.isPristine);
      expect(state.isTouched).toEqual(INITIAL_STATE.isTouched);
      expect(state.isUntouched).toEqual(INITIAL_STATE.isUntouched);
      expect(state.isSubmitted).toEqual(INITIAL_STATE.isSubmitted);
      expect(state.isUnsubmitted).toEqual(INITIAL_STATE.isUnsubmitted);
      expect(state.userDefinedProperties).toEqual(INITIAL_STATE.userDefinedProperties);
    });

    it('should produce the same state as is computed after an action is applied for empty array', () => {
      const initialState = createFormArrayState(FORM_CONTROL_ID, []);
      const state = computeArrayState(
        initialState.id,
        initialState.controls,
        initialState.value,
        initialState.errors,
        initialState.pendingValidations,
        initialState.userDefinedProperties,
        {
          wasOrShouldBeEnabled: true,
        },
      );

      expect(state.id).toBe(initialState.id);
      expect(state.value).toEqual(initialState.value);
      expect(state.errors).toEqual(initialState.errors);
      expect(state.pendingValidations).toEqual(initialState.pendingValidations);
      expect(state.isValid).toEqual(initialState.isValid);
      expect(state.isInvalid).toEqual(initialState.isInvalid);
      expect(state.isEnabled).toEqual(initialState.isEnabled);
      expect(state.isDisabled).toEqual(initialState.isDisabled);
      expect(state.isDirty).toEqual(initialState.isDirty);
      expect(state.isPristine).toEqual(initialState.isPristine);
      expect(state.isTouched).toEqual(initialState.isTouched);
      expect(state.isUntouched).toEqual(initialState.isUntouched);
      expect(state.isSubmitted).toEqual(initialState.isSubmitted);
      expect(state.isUnsubmitted).toEqual(initialState.isUnsubmitted);
      expect(state.userDefinedProperties).toEqual(initialState.userDefinedProperties);
    });
  });

  describe(createChildState.name, () => {
    it('should create a form control for string values', () => {
      expect(createChildState('', 'A').isFocused).toBeDefined();
    });

    it('should create a form control for number values', () => {
      expect(createChildState('', 1).isFocused).toBeDefined();
    });

    it('should create a form control for boolean values', () => {
      expect(createChildState('', true).isFocused).toBeDefined();
    });

    it('should create a form array for array values', () => {
      const state = createChildState('', ['A']);
      expect(state.controls).toBeDefined();
      expect(Array.isArray(state.controls)).toBe(true);
    });

    it('should create a form group for object values', () => {
      const state = createChildState('', { inner: 'A' });
      expect(state.controls).toBeDefined();
      expect(Array.isArray(state.controls)).toBe(false);
    });

    it('should create a form control for boxed array values', () => {
      expect(createChildState('', box(['A'])).isFocused).toBeDefined();
    });

    it('should create a form control for boxed object values', () => {
      expect(createChildState('', box({ inner: 'A' })).isFocused).toBeDefined();
    });
  });

  describe(verifyFormControlValueIsValid.name, () => {
    it('should return valid control values unmodified', () => {
      const stringValue = 'A';
      const numberValue = 101;
      const booleanValue = true;
      const nullValue = null;
      const undefinedValue = undefined;
      expect(verifyFormControlValueIsValid(stringValue)).toBe(stringValue);
      expect(verifyFormControlValueIsValid(numberValue)).toBe(numberValue);
      expect(verifyFormControlValueIsValid(booleanValue)).toBe(booleanValue);
      expect(verifyFormControlValueIsValid(nullValue)).toBe(nullValue);
      expect(verifyFormControlValueIsValid(undefinedValue)).toBe(undefinedValue);
    });

    it('should throw for invalid values', () => {
      const objectValue = { v: 'A' };
      const arrayValue = ['A'];
      const functionValue = () => void 0;
      expect(() => verifyFormControlValueIsValid(objectValue)).toThrowError();
      expect(() => verifyFormControlValueIsValid(arrayValue)).toThrowError();
      expect(() => verifyFormControlValueIsValid(functionValue)).toThrowError();
    });

    it('should return boxed serializable values unmodified', () => {
      const boxedStringValue = box('A');
      const boxedNumberValue = box(1);
      const boxedBooleanValue = box(true);
      const boxedObjectValue = box({ v: 'A' });
      const boxedArrayValue = box(['A']);
      const boxedNullValue = box(null);
      const boxedUndefinedValue = box(undefined);
      expect(verifyFormControlValueIsValid(boxedStringValue)).toBe(boxedStringValue);
      expect(verifyFormControlValueIsValid(boxedNumberValue)).toBe(boxedNumberValue);
      expect(verifyFormControlValueIsValid(boxedBooleanValue)).toBe(boxedBooleanValue);
      expect(verifyFormControlValueIsValid(boxedObjectValue)).toBe(boxedObjectValue);
      expect(verifyFormControlValueIsValid(boxedArrayValue)).toBe(boxedArrayValue);
      expect(verifyFormControlValueIsValid(boxedNullValue)).toBe(boxedNullValue);
      expect(verifyFormControlValueIsValid(boxedUndefinedValue)).toBe(boxedUndefinedValue);
    });

    it('should return boxed serializable values with undefined properties', () => {
      const boxedUndefinedObjectValue = box({ v: 'A', u: undefined });
      expect(verifyFormControlValueIsValid(boxedUndefinedObjectValue)).toEqual(boxedUndefinedObjectValue);

      const boxedSubUndefinedObjectValue = box({ v: 'A', u: { u: undefined } });
      expect(verifyFormControlValueIsValid(boxedSubUndefinedObjectValue)).toEqual(boxedSubUndefinedObjectValue);
    });

    it('should throw for non-serializable boxed values', () => {
      const boxedFunctionValue = box(() => void 0);
      const boxedObjectWithFunctionValue = box({ f: () => void 0 });
      expect(() => verifyFormControlValueIsValid(boxedFunctionValue)).toThrowError();
      expect(() => verifyFormControlValueIsValid(boxedObjectWithFunctionValue)).toThrowError();
    });
  });

  describe(isArrayState.name, () => {
    it('should return true for array state', () => {
      const INITIAL_STATE = createFormArrayState<string>(FORM_CONTROL_ID, ['abc']);
      expect(isArrayState(INITIAL_STATE)).toBe(true);
    });

    it('should return false for group state', () => {
      const INITIAL_STATE = createFormGroupState<any>(FORM_CONTROL_ID, { control: 'abc' });
      expect(isArrayState(INITIAL_STATE)).toBe(false);
    });

    it('should return false for control state', () => {
      const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, 'abc');
      expect(isArrayState(INITIAL_STATE)).toBe(false);
    });

    it('should return false for update object', () => {
      expect(isArrayState({ controls: () => void 0 } as any)).toBe(false);
    });
  });

  describe(isGroupState.name, () => {
    it('should return true for group state', () => {
      const INITIAL_STATE = createFormGroupState<any>(FORM_CONTROL_ID, { control: 'abc' });
      expect(isGroupState(INITIAL_STATE)).toBe(true);
    });

    it('should return false for control state', () => {
      const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, 'abc');
      expect(isGroupState(INITIAL_STATE)).toBe(false);
    });

    it('should return false for array state', () => {
      const INITIAL_STATE = createFormArrayState<string>(FORM_CONTROL_ID, ['abc']);
      expect(isGroupState(INITIAL_STATE)).toBe(false);
    });

    it('should return false for update object', () => {
      expect(isGroupState({ controls: () => void 0 } as any)).toBe(false);
    });
  });

  describe(computeArrayState.name, () => {
    const VALUE = ['a', 'b'];
    const CONTROL_1 = createFormControlState(FORM_CONTROL_0_ID, VALUE[0]);
    const CONTROL_2 = createFormControlState(FORM_CONTROL_1_ID, VALUE[1]);
    const CONTROLS = [CONTROL_1, CONTROL_2];

    it('should aggregate child values', () => {
      const state = computeArrayState<string>(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, {});
      expect(state.value).toEqual(VALUE);
    });

    it('should aggregate child errors', () => {
      const childError = { required: true };
      const controlWithError = {
        ...CONTROL_1,
        errors: childError,
        isValid: false,
        isInvalid: true,
      };
      const state = computeArrayState<string>(FORM_CONTROL_ID, [controlWithError, CONTROL_2], [], {}, [], {}, {});
      expect(state.errors).toEqual({ _0: childError });
    });

    it('should merge own errors with child errors', () => {
      const childError = { required: true };
      const ownError = { max: true };
      const controlWithError = {
        ...CONTROL_1,
        errors: childError,
        isValid: false,
        isInvalid: true,
      };
      const state = computeArrayState<string>(FORM_CONTROL_ID, [controlWithError, CONTROL_2], [], ownError, [], {}, {});
      expect(state.errors).toEqual({ _0: childError, ...ownError });
    });

    it('should mark as valid if there are no errors', () => {
      const state = computeArrayState<string>(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, {});
      expect(state.isValid).toBe(true);
      expect(state.isInvalid).toBe(false);
    });

    it('should mark as invalid if there are errors', () => {
      const errors = { max: true };
      const state = computeArrayState<string>(FORM_CONTROL_ID, CONTROLS, [], errors, [], {}, {});
      expect(state.isValid).toBe(false);
      expect(state.isInvalid).toBe(true);
    });

    it('should mark as pristine if no child is dirty and state was not dirty', () => {
      const state = computeArrayState<string>(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, {});
      expect(state.isDirty).toBe(false);
      expect(state.isPristine).toBe(true);
    });

    it('should mark as dirty if some child is dirty and state was not dirty', () => {
      const dirtyControl = {
        ...CONTROL_1,
        isDirty: true,
        isPristine: false,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [dirtyControl, CONTROL_2], [], {}, [], {}, {});
      expect(state.isDirty).toBe(true);
      expect(state.isPristine).toBe(false);
    });

    it('should mark as dirty if no child is dirty and state was dirty', () => {
      const state = computeArrayState(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, { wasOrShouldBeDirty: true });
      expect(state.isDirty).toBe(true);
      expect(state.isPristine).toBe(false);
    });

    it('should mark as pristine if array is empty and state was not dirty', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, {});
      expect(state.isDirty).toBe(false);
      expect(state.isPristine).toBe(true);
    });

    it('should mark as dirty if array is empty and state was dirty', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeDirty: true });
      expect(state.isDirty).toBe(true);
      expect(state.isPristine).toBe(false);
    });

    it('should mark as enabled if some child is enabled and state was enabled', () => {
      const disabledControl = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [disabledControl, CONTROL_2], [], {}, [], {}, { wasOrShouldBeEnabled: true });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as enabled if some child is enabled and state was not enabled', () => {
      const disabledControl = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [disabledControl, CONTROL_2], [], {}, [], {}, { wasOrShouldBeEnabled: false });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as enabled if all children are disabled and state was enabled', () => {
      const disabledControl1 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const disabledControl2 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [disabledControl1, disabledControl2], [], {}, [], {}, { wasOrShouldBeEnabled: true });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as disabled if all children are disabled and state was not enabled', () => {
      const disabledControl1 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const disabledControl2 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [disabledControl1, disabledControl2], [], {}, [], {}, { wasOrShouldBeEnabled: false });
      expect(state.isEnabled).toBe(false);
      expect(state.isDisabled).toBe(true);
    });

    it('should mark as enabled if group is empty and state was enabled', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeEnabled: true });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as disabled if group is empty and state was not enabled', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeEnabled: false });
      expect(state.isEnabled).toBe(false);
      expect(state.isDisabled).toBe(true);
    });

    it('should mark as untouched if no child is touched and state was not touched', () => {
      const state = computeArrayState(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, { wasOrShouldBeTouched: false });
      expect(state.isTouched).toBe(false);
      expect(state.isUntouched).toBe(true);
    });

    it('should mark as touched if no child is touched and state was touched', () => {
      const state = computeArrayState(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, { wasOrShouldBeTouched: true });
      expect(state.isTouched).toBe(true);
      expect(state.isUntouched).toBe(false);
    });

    it('should mark as touched if some child is touched and state was not touched', () => {
      const touchedControl = {
        ...CONTROL_1,
        isTouched: true,
        isUntouched: false,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [touchedControl, CONTROL_2], [], {}, [], {}, { wasOrShouldBeTouched: false });
      expect(state.isTouched).toBe(true);
      expect(state.isUntouched).toBe(false);
    });

    it('should mark as untouched if array is empty and state was not touched', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeTouched: false });
      expect(state.isTouched).toBe(false);
      expect(state.isUntouched).toBe(true);
    });

    it('should mark as touched if array is empty and state was touched', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeTouched: true });
      expect(state.isTouched).toBe(true);
      expect(state.isUntouched).toBe(false);
    });

    it('should mark as unsubmitted if no child is submitted and state was not submitted', () => {
      const state = computeArrayState(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, { wasOrShouldBeSubmitted: false });
      expect(state.isSubmitted).toBe(false);
      expect(state.isUnsubmitted).toBe(true);
    });

    it('should mark as submitted if no child is submitted and state was submitted', () => {
      const state = computeArrayState(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, { wasOrShouldBeSubmitted: true });
      expect(state.isSubmitted).toBe(true);
      expect(state.isUnsubmitted).toBe(false);
    });

    it('should mark as submitted if some child is submitted and state was not submitted', () => {
      const submittedControl = {
        ...CONTROL_1,
        isSubmitted: true,
        isUnsubmitted: false,
      };
      const state = computeArrayState(FORM_CONTROL_ID, [submittedControl, CONTROL_2], [], {}, [], {}, { wasOrShouldBeSubmitted: false });
      expect(state.isSubmitted).toBe(true);
      expect(state.isUnsubmitted).toBe(false);
    });

    it('should mark as unsubmitted if array is empty and state was not submitted', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeSubmitted: false });
      expect(state.isSubmitted).toBe(false);
      expect(state.isUnsubmitted).toBe(true);
    });

    it('should mark as submitted if array is empty and state was submitted', () => {
      const state = computeArrayState(FORM_CONTROL_ID, [], [], {}, [], {}, { wasOrShouldBeSubmitted: true });
      expect(state.isSubmitted).toBe(true);
      expect(state.isUnsubmitted).toBe(false);
    });

    it('should mark as validation pending if child has pending validations', () => {
      const validationPendingControl = {
        ...CONTROL_1,
        pendingValidations: ['test'],
        isValidationPending: true,
      };
      const state = computeArrayState<string>(FORM_CONTROL_ID, [validationPendingControl, CONTROL_2], [], {}, [], {}, {});
      expect(state.isValidationPending).toEqual(true);
    });

    it('should mark as validation pending if array has pending validations', () => {
      const state = computeArrayState<string>(FORM_CONTROL_ID, CONTROLS, [], {}, ['test'], {}, {});
      expect(state.isValidationPending).toEqual(true);
    });

    it('should mark as no validation pending if no validations are pending', () => {
      const state = computeArrayState<string>(FORM_CONTROL_ID, CONTROLS, [], {}, [], {}, {});
      expect(state.isValidationPending).toEqual(false);
    });
  });

  describe(computeGroupState.name, () => {
    const VALUE = { inner1: 'a', inner2: 'b' };
    const CONTROL_1 = createFormControlState(FORM_CONTROL_INNER_ID, VALUE.inner1);
    const CONTROL_2 = createFormControlState(FORM_CONTROL_INNER2_ID, VALUE.inner2);
    const CONTROLS = { inner1: CONTROL_1, inner2: CONTROL_2 };

    it('should aggregate child values', () => {
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, CONTROLS, { inner1: '', inner2: '' }, {}, [], {}, {});
      expect(state.value).toEqual(VALUE);
    });

    it('should aggregate child errors', () => {
      const childError = { required: true };
      const controlWithError = {
        ...CONTROL_1,
        errors: childError,
        isValid: false,
        isInvalid: true,
      };
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, { inner1: controlWithError, inner2: CONTROL_2 }, VALUE, {}, [], {}, {});
      expect(state.errors).toEqual({ _inner1: childError });
    });

    it('should merge own errors with child errors', () => {
      const childError = { required: true };
      const ownError = { max: true };
      const controlWithError = {
        ...CONTROL_1,
        errors: childError,
        isValid: false,
        isInvalid: true,
      };
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, { inner1: controlWithError, inner2: CONTROL_2 }, VALUE, ownError, [], {}, {});
      expect(state.errors).toEqual({ _inner1: childError, ...ownError });
    });

    it('should mark as valid if there are no errors', () => {
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, {});
      expect(state.isValid).toBe(true);
      expect(state.isInvalid).toBe(false);
    });

    it('should mark as invalid if there are errors', () => {
      const errors = { max: true };
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, CONTROLS, VALUE, errors, [], {}, {});
      expect(state.isValid).toBe(false);
      expect(state.isInvalid).toBe(true);
    });

    it('should mark as pristine if no child is dirty and state was not dirty', () => {
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, { wasOrShouldBeDirty: false });
      expect(state.isDirty).toBe(false);
      expect(state.isPristine).toBe(true);
    });

    it('should mark as dirty if no child is dirty and state was dirty', () => {
      const state = computeGroupState<typeof VALUE>(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, { wasOrShouldBeDirty: true });
      expect(state.isDirty).toBe(true);
      expect(state.isPristine).toBe(false);
    });

    it('should mark as dirty if some child is dirty and state was not dirty', () => {
      const dirtyControl = {
        ...CONTROL_1,
        isDirty: true,
        isPristine: false,
      };
      const state = computeGroupState(FORM_CONTROL_ID, { inner1: dirtyControl, inner2: CONTROL_2 }, VALUE, {}, [], {}, { wasOrShouldBeDirty: false });
      expect(state.isDirty).toBe(true);
      expect(state.isPristine).toBe(false);
    });

    it('should mark as pristine if group is empty and state was not dirty', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeDirty: false });
      expect(state.isDirty).toBe(false);
      expect(state.isPristine).toBe(true);
    });

    it('should mark as dirty if group is empty and state was dirty', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeDirty: true });
      expect(state.isDirty).toBe(true);
      expect(state.isPristine).toBe(false);
    });

    it('should mark as enabled if some child is enabled and state was enabled', () => {
      const disabledControl = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const state = computeGroupState(FORM_CONTROL_ID, { inner1: disabledControl, inner2: CONTROL_2 }, VALUE, {}, [], {}, { wasOrShouldBeEnabled: true });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as enabled if some child is enabled and state was not enabled', () => {
      const disabledControl = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const state = computeGroupState(FORM_CONTROL_ID, { inner1: disabledControl, inner2: CONTROL_2 }, VALUE, {}, [], {}, { wasOrShouldBeEnabled: false });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as enabled if all children are disabled and state was enabled', () => {
      const disabledControl1 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const disabledControl2 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const disabledControls = { inner1: disabledControl1, inner2: disabledControl2 };
      const state = computeGroupState(FORM_CONTROL_ID, disabledControls, VALUE, {}, [], {}, { wasOrShouldBeEnabled: true });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as disabled if all children are disabled and state was not enabled', () => {
      const disabledControl1 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const disabledControl2 = {
        ...CONTROL_1,
        isEnabled: false,
        isDisabled: true,
      };
      const disabledControls = { inner1: disabledControl1, inner2: disabledControl2 };
      const state = computeGroupState(FORM_CONTROL_ID, disabledControls, VALUE, {}, [], {}, { wasOrShouldBeEnabled: false });
      expect(state.isEnabled).toBe(false);
      expect(state.isDisabled).toBe(true);
    });

    it('should mark as enabled if group is empty and state was enabled', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeEnabled: true });
      expect(state.isEnabled).toBe(true);
      expect(state.isDisabled).toBe(false);
    });

    it('should mark as disabled if group is empty and state was not enabled', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeEnabled: false });
      expect(state.isEnabled).toBe(false);
      expect(state.isDisabled).toBe(true);
    });

    it('should mark as untouched if no child is touched and state was not touched', () => {
      const state = computeGroupState(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, { wasOrShouldBeTouched: false });
      expect(state.isTouched).toBe(false);
      expect(state.isUntouched).toBe(true);
    });

    it('should mark as touched if no child is touched and state was touched', () => {
      const state = computeGroupState(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, { wasOrShouldBeTouched: true });
      expect(state.isTouched).toBe(true);
      expect(state.isUntouched).toBe(false);
    });

    it('should mark as touched if some child is touched and state was not touched', () => {
      const touchedControl = {
        ...CONTROL_1,
        isTouched: true,
        isUntouched: false,
      };
      const state = computeGroupState(FORM_CONTROL_ID, { inner1: touchedControl, inner2: CONTROL_2 }, VALUE, {}, [], {}, { wasOrShouldBeTouched: false });
      expect(state.isTouched).toBe(true);
      expect(state.isUntouched).toBe(false);
    });

    it('should mark as untouched if group is empty and state was not touched', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeTouched: false });
      expect(state.isTouched).toBe(false);
      expect(state.isUntouched).toBe(true);
    });

    it('should mark as touched if group is empty and state was touched', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeTouched: true });
      expect(state.isTouched).toBe(true);
      expect(state.isUntouched).toBe(false);
    });

    it('should mark as unsubmitted if no child is submitted and state was not submitted', () => {
      const state = computeGroupState(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, { wasOrShouldBeSubmitted: false });
      expect(state.isSubmitted).toBe(false);
      expect(state.isUnsubmitted).toBe(true);
    });

    it('should mark as submitted if no child is submitted and state was submitted', () => {
      const state = computeGroupState(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, { wasOrShouldBeSubmitted: true });
      expect(state.isSubmitted).toBe(true);
      expect(state.isUnsubmitted).toBe(false);
    });

    it('should mark as submitted if some child is submitted and state was not submitted', () => {
      const submittedControl = {
        ...CONTROL_1,
        isSubmitted: true,
        isUnsubmitted: false,
      };
      const state = computeGroupState(FORM_CONTROL_ID, { inner1: submittedControl, inner2: CONTROL_2 }, VALUE, {}, [], {}, { wasOrShouldBeSubmitted: false });
      expect(state.isSubmitted).toBe(true);
      expect(state.isUnsubmitted).toBe(false);
    });

    it('should mark as unsubmitted if group is empty and state was not submitted', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeSubmitted: false });
      expect(state.isSubmitted).toBe(false);
      expect(state.isUnsubmitted).toBe(true);
    });

    it('should mark as submitted if group is empty and state was submitted', () => {
      const state = computeGroupState(FORM_CONTROL_ID, {}, {}, {}, [], {}, { wasOrShouldBeSubmitted: true });
      expect(state.isSubmitted).toBe(true);
      expect(state.isUnsubmitted).toBe(false);
    });

    it('should mark as validation pending if child has pending validations', () => {
      const validationPendingControl = {
        ...CONTROL_1,
        pendingValidations: ['test'],
        isValidationPending: true,
      };
      const state = computeGroupState(FORM_CONTROL_ID, { inner1: validationPendingControl, inner2: CONTROL_2 }, VALUE, {}, [], {}, {});
      expect(state.isValidationPending).toBe(true);
    });

    it('should mark as validation pending if group has pending validations', () => {
      const state = computeGroupState(FORM_CONTROL_ID, CONTROLS, VALUE, {}, ['test'], {}, {});
      expect(state.isValidationPending).toBe(true);
    });

    it('should mark as no validation pending if no validations are pending', () => {
      const state = computeGroupState(FORM_CONTROL_ID, CONTROLS, VALUE, {}, [], {}, {});
      expect(state.isValidationPending).toBe(false);
    });
  });
});
