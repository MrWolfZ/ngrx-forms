import { FormGroupState, createFormGroupState } from '../../state';
import { SetValueAction } from '../../actions';
import { setValueReducer } from './set-value';

describe('form group setValueReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

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

  it('should mark state as dirty if value is different', () => {
    const value = { inner: 'A' };
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.isDirty).toEqual(true);
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
    expect(resultState.controls.inner2.value).toEqual(value.inner2);
  });

  it('should create child states on demand for group children', () => {
    const value = { inner: 'A', inner3: { inner4: 'C' } };
    const resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls.inner3.value).toEqual(value.inner3);
  });

  it('should create child states on demand for null children', () => {
    const value = { inner: 'A', inner2: null as any as string };
    const resultState = setValueReducer<FormGroupValue>(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
    expect(resultState.controls.inner2.value).toEqual(value.inner2);
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
    const resultState = setValueReducer<FormValue>(state, new SetValueAction(id, {}));
    expect(resultState.value).toEqual({});
    expect(resultState.controls.inner).toBeUndefined();
  });

  it('should aggregate child values', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value) as any);
    expect(resultState.value).toEqual({ inner: 'A' });
  });

  it('should mark state as dirty if child value is updated', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, value) as any);
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.controls.inner.isDirty).toEqual(true);
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

  it('should mark state as dirty if group child value is updated', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = { inner4: 'D' };
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER3_ID, value) as any);
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.controls.inner3.isDirty).toEqual(true);
  });

  it('should aggregate nested child values', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = 'D';
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER4_ID, value) as any);
    expect(resultState.value.inner3!.inner4).toEqual(value);
  });

  it('should mark state as dirty if nested child value is updated', () => {
    let resultState = setValueReducer<FormGroupValue>(
      INITIAL_STATE,
      new SetValueAction(FORM_CONTROL_ID, { inner: 'A', inner3: { inner4: 'C' } }),
    );
    const value = 'D';
    resultState = setValueReducer(resultState, new SetValueAction(FORM_CONTROL_INNER4_ID, value) as any);
    expect(resultState.isDirty).toEqual(true);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDirty).toEqual(true);
  });

  it('should remove child errors on demand when value is empty', () => {
    interface FormValue { inner?: number; }
    const id = 'ID';
    const errors = { required: true };
    let state = createFormGroupState<FormValue>(id, { inner: 5 });
    state = {
      ...state,
      controls: {
        inner: {
          ...state.controls.inner,
          errors,
        },
      },
    };
    const resultState = setValueReducer<FormValue>(state, new SetValueAction(id, {}));
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
      errors,
      controls: {
        inner: {
          ...state.controls.inner,
          errors,
        },
      },
    };
    const resultState = setValueReducer<FormValue>(state, new SetValueAction(id, {}));
    expect(resultState.value).toEqual({});
    expect(resultState.errors).toEqual(errors);
    expect(resultState.controls.inner).toBeUndefined();
  });
});
