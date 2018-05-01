import { SetValueAction } from '../../actions';
import { FormArrayState } from '../../state';
import { setValueReducer } from './set-value';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
} from './test-util';

describe(`form array ${setValueReducer.name}`, () => {
  it('should update state value if different', () => {
    const value = ['A', ''];
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
  });

  it('should not update state value if same', () => {
    const value = ['', ''];
    const state = { ...INITIAL_STATE, value };
    const resultState = setValueReducer(state, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState).toBe(state);
  });

  it('should not mark state as dirty', () => {
    const value = ['A', ''];
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.isDirty).toEqual(false);
  });

  it('should update child state value', () => {
    const value = ['A', ''];
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.controls[0].value).toEqual(value[0]);
  });

  it('should create child states on demand', () => {
    const value = ['', '', ''];
    const resultState = setValueReducer<string>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls[2].value).toEqual(value[2]);
  });

  it('should create child states on demand for group children', () => {
    const value = [{ inner: '' }, { inner: '' }, { inner: '' }];
    const resultState = setValueReducer<typeof value[0]>(INITIAL_STATE_NESTED_GROUP, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls[2].value).toEqual(value[2]);
  });

  it('should create child states on demand for array children', () => {
    const value = [[''], [''], ['']];
    const resultState = setValueReducer<typeof value[0]>(INITIAL_STATE_NESTED_ARRAY, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls[2].value).toEqual(value[2]);
  });

  it('should create child states on demand for null children', () => {
    const value = ['', '', null];
    const resultState = setValueReducer<string | null>(INITIAL_STATE as FormArrayState<string | null>, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls[2].value).toEqual(value[2]);
  });

  it('should remove child states on demand', () => {
    const value = [''];
    const resultState = setValueReducer<string>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls[1]).toBeUndefined();
  });

  it('should remove child states on demand when value is empty', () => {
    const value: string[] = [];
    const resultState = setValueReducer<string>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls[0]).toBeUndefined();
  });

  it('should aggregate child values', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_0_ID, value) as any);
    expect(resultState.value).toEqual([value, '']);
  });

  it('should not mark state as dirty if child value is updated', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_0_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls[0].isDirty).toEqual(false);
  });

  it('should aggregate child values for group children', () => {
    const value = { inner: 'A' };
    const resultState = setValueReducer(INITIAL_STATE_NESTED_GROUP, new SetValueAction(FORM_CONTROL_0_ID, value) as any);
    expect(resultState.value).toEqual([value, { inner: '' }]);
  });

  it('should not mark state as dirty if group child value is updated', () => {
    const value = { inner: 'A' };
    const resultState = setValueReducer(INITIAL_STATE_NESTED_GROUP, new SetValueAction(FORM_CONTROL_0_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls[0].isDirty).toEqual(false);
  });

  it('should aggregate child values for array children', () => {
    const value = ['A'];
    const resultState = setValueReducer(INITIAL_STATE_NESTED_ARRAY, new SetValueAction(FORM_CONTROL_0_ID, value) as any);
    expect(resultState.value).toEqual([value, ['']]);
  });

  it('should not mark state as dirty if array child value is updated', () => {
    const value = ['A'];
    const resultState = setValueReducer(INITIAL_STATE_NESTED_ARRAY, new SetValueAction(FORM_CONTROL_0_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls[0].isDirty).toEqual(false);
  });

  it('should remove child errors on demand when value is empty', () => {
    const errors = { required: true };
    const state = {
      ...INITIAL_STATE,
      errors: {
        _0: errors,
      },
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          errors,
        },
        INITIAL_STATE.controls[1],
      ],
    };
    const resultState = setValueReducer<string>(state, new SetValueAction(FORM_CONTROL_ID, []));
    expect(resultState.value).toEqual([]);
    expect(resultState.errors).toEqual({});
    expect(resultState.controls[0]).toBeUndefined();
  });

  it('should remove child errors and keep own errors on demand when value is empty', () => {
    const errors = { required: true };
    const state = {
      ...INITIAL_STATE,
      errors: {
        _0: errors,
        ...errors,
      },
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          errors,
        },
        INITIAL_STATE.controls[1],
      ],
    };
    const resultState = setValueReducer<string>(state, new SetValueAction(FORM_CONTROL_ID, []));
    expect(resultState.value).toEqual([]);
    expect(resultState.errors).toEqual(errors);
    expect(resultState.controls[0]).toBeUndefined();
  });

  it('should throw if trying to set date as value', () => {
    const action = new SetValueAction(FORM_CONTROL_ID, new Date() as any);
    expect(() => setValueReducer(INITIAL_STATE, action)).toThrowError();
  });
});
