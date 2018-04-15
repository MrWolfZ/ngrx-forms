import { SetValueAction } from '../../actions';
import { createFormGroupState } from '../../state';
import { setValueReducer } from './set-value';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER4_ID,
  FORM_CONTROL_INNER5_0_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  FormGroupValue,
  INITIAL_STATE,
} from './test-util';

describe(`form group ${setValueReducer.name}`, () => {
  it('should update state value if different', () => {
    const value = { inner: 'A' };
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
  });

  it('should not update state value if same', () => {
    const value = { inner: 'A' };
    const state = { ...INITIAL_STATE, value };
    const resultState = setValueReducer(state, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState).toBe(state);
  });

  it('should not mark state as dirty', () => {
    const value = { inner: 'A' };
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.isDirty).toEqual(false);
  });

  it('should update child state value', () => {
    const value = { inner: 'A' };
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.controls.inner.value).toEqual(value.inner);
  });

  it('should create child states on demand', () => {
    const value = { inner: 'A', inner2: 'B' };
    const resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls.inner2!.value).toEqual(value.inner2);
  });

  it('should create child states on demand for group children', () => {
    const value = { inner: 'A', inner3: { inner4: 'C' } };
    const resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls.inner3!.value).toEqual(value.inner3);
  });

  it('should create child states on demand for array children', () => {
    const value = { inner: 'A', inner5: ['C'] };
    const resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls.inner5!.value).toEqual(value.inner5);
  });

  it('should create child states on demand for null children', () => {
    const value = { inner: 'A', inner2: null as any as string };
    const resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls.inner2!.value).toEqual(value.inner2);
  });

  it('should remove child states on demand', () => {
    const value = { inner: 'A', inner2: 'B' };
    let resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    const value2 = { inner: 'A' };
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_ID, value2));
    expect(resultState.value).toEqual(value2);
    expect(resultState.controls.inner2).toBeUndefined();
  });

  it('should remove child states on demand when value is empty', () => {
    interface FormValue { inner?: number; }
    const id = 'ID';
    const state = createFormGroupState<FormValue>(id, { inner: 5 });
    const resultState = setValueReducer<FormValue>(state, new SetValueAction<{}>(id, {}));
    expect(resultState.value).toEqual({});
    expect(resultState.controls.inner).toBeUndefined();
  });

  it('should aggregate child values', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value) as any);
    expect(resultState.value).toEqual({ inner: 'A' });
  });

  it('should not mark state as dirty if child value is updated', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls.inner.isDirty).toEqual(false);
  });

  it('should aggregate child values for group children', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = { inner4: 'D' };
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER3_ID, value) as any);
    expect(resultState.value.inner3).toEqual(value);
  });

  it('should aggregate child values for array children', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner5: ['C'] }),
    );
    const value = ['D'];
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER5_ID, value) as any);
    expect(resultState.value.inner5).toEqual(value);
  });

  it('should not mark state as dirty if group child value is updated', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = { inner4: 'D' };
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER3_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls.inner3!.isDirty).toEqual(false);
  });

  it('should not mark state as dirty if array child value is updated', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner5: ['C'] }),
    );
    const value = ['D'];
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER5_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls.inner5!.isDirty).toEqual(false);
  });

  it('should aggregate nested child values in groups', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = 'D';
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER4_ID, value) as any);
    expect(resultState.value.inner3!.inner4).toEqual(value);
  });

  it('should aggregate nested child values in arrays', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner5: ['C'] }),
    );
    const value = 'D';
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER5_0_ID, value) as any);
    expect(resultState.value.inner5![0]).toEqual(value);
  });

  it('should not mark state as dirty if nested child value in group is updated', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = 'D';
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER4_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls.inner3!.controls.inner4.isDirty).toEqual(false);
  });

  it('should not mark state as dirty if nested child value in array is updated', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner5: ['C'] }),
    );
    const value = 'D';
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER5_0_ID, value) as any);
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.controls.inner5!.controls[0].isDirty).toEqual(false);
  });

  it('should remove child errors on demand when value is empty', () => {
    interface FormValue { inner?: number; }
    const id = 'ID';
    const errors = { required: true };
    let state = createFormGroupState<FormValue>(id, { inner: 5 });
    state = {
      ...state,
      errors: {
        _inner: errors,
      },
      controls: {
        inner: {
          ...state.controls.inner!,
          errors,
        },
      },
    };
    const resultState = setValueReducer<FormValue>(state, new SetValueAction<{}>(id, {}));
    expect(resultState.value).toEqual({});
    expect(resultState.errors).toEqual({});
    expect(resultState.controls.inner).toBeUndefined();
  });

  it('should remove child errors and keep own errors on demand when value is empty', () => {
    interface FormValue { inner?: number; }
    const id = 'ID';
    const errors = { required: true };
    let state = createFormGroupState<FormValue>(id, { inner: 5 });
    state = {
      ...state,
      errors: {
        _inner: errors,
        ...errors,
      },
      controls: {
        inner: {
          ...state.controls.inner!,
          errors,
        },
      },
    };
    const resultState = setValueReducer<FormValue>(state, new SetValueAction<{}>(id, {}));
    expect(resultState.value).toEqual({});
    expect(resultState.errors).toEqual(errors);
    expect(resultState.controls.inner).toBeUndefined();
  });
});
