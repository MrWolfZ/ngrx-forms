import { SetValueAction, SetUserDefinedPropertyAction } from './actions';
import {
  cast,
  computeGroupState,
  createFormArrayState,
  createFormControlState,
  createFormGroupState,
  isGroupState,
  isArrayState,
} from './state';
import { formGroupReducer } from './group/reducer';
import { formArrayReducer } from './array/reducer';

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
      expect(cast(INITIAL_STATE.controls.control).isFocused).toBeDefined();
    });

    it('should create group child', () => {
      expect(INITIAL_STATE.controls.group.value).toEqual(GROUP_VALUE);
      const controls = cast(INITIAL_STATE.controls.group).controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(false);
    });

    it('should create array child', () => {
      expect(INITIAL_STATE.controls.array.value).toEqual(ARRAY_VALUE);
      const controls = cast(INITIAL_STATE.controls.array).controls;
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
      expect(cast(INITIAL_STATE.controls[0]).isFocused).toBeDefined();
    });

    it('should create group child', () => {
      const initialValue = [{ control: 'a' }, { control: 'b' }];
      const initialState = createFormArrayState<{ control: string }>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls[0].value).toEqual(initialValue[0]);
      const controls = cast(initialState.controls[0]).controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(false);
    });

    it('should create array child', () => {
      const initialValue = [['a'], ['b']];
      const initialState = createFormArrayState<string[]>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls[0].value).toEqual(initialValue[0]);
      const controls = cast(initialState.controls[0]).controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(true);
    });

    it('should create mixed children', () => {
      const initialValue = [['a'], { control: 'b' }];
      const initialState = createFormArrayState<string[] | { control: string }>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls[0].value).toEqual(initialValue[0]);
      const controls = cast(initialState.controls[0]).controls;
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(true);
      expect(initialState.controls[1].value).toEqual(initialValue[1]);
      const controls2 = cast(initialState.controls[1]).controls;
      expect(controls2).toBeDefined();
      expect(Array.isArray(controls2)).toBe(false);
    });

    it('should create empty children array for empty value array', () => {
      const initialValue = [] as string[];
      const initialState = createFormArrayState<string>(FORM_CONTROL_ID, initialValue);
      expect(initialState.controls).toEqual([]);
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
});
