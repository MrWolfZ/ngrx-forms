import { cast, createFormArrayState, createFormControlState, createFormGroupState } from './state';

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
    const INITIAL_VALUE = { control: 'abc', group: GROUP_VALUE, array: ARRAY_VALUE };
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
  });
});
