import { createFormGroupState } from '../../state';
import { RemoveControlAction } from '../../actions';
import { removeControlReducer } from './remove-control';

describe('form group removeControlReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; inner5?: string[]; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' }, inner5: [''] };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

  it('should remove child state', () => {
    const action = new RemoveControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner2');
    const resultState = removeControlReducer<FormGroupValue>(INITIAL_STATE_FULL, action);
    expect(resultState.value).toEqual({ inner: '', inner3: { inner4: '' }, inner5: [''] });
    expect(resultState.controls.inner2).toBeUndefined();
  });

  it('should remove child state for group children', () => {
    const action = new RemoveControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner3');
    const resultState = removeControlReducer<FormGroupValue>(INITIAL_STATE_FULL, action);
    expect(resultState.value).toEqual({ inner: '', inner2: '', inner5: [''] });
    expect(resultState.controls.inner3).toBeUndefined();
  });

  it('should remove child state for array children', () => {
    const action = new RemoveControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner5');
    const resultState = removeControlReducer<FormGroupValue>(INITIAL_STATE_FULL, action);
    expect(resultState.value).toEqual({ inner: '', inner2: '', inner3: { inner4: '' } });
    expect(resultState.controls.inner5).toBeUndefined();
  });

  it('should remove child errors for removed child', () => {
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
          ...state.controls.inner,
          errors,
        },
      },
    };
    const action = new RemoveControlAction<FormValue>(FORM_CONTROL_ID, 'inner');
    const resultState = removeControlReducer<FormValue>(state, action);
    expect(resultState.value).toEqual({});
    expect(resultState.errors).toEqual({});
    expect(resultState.controls.inner).toBeUndefined();
  });

  it('should remove child errors for removed child and keep own errors', () => {
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
          ...state.controls.inner,
          errors,
        },
      },
    };
    const action = new RemoveControlAction<FormValue>(FORM_CONTROL_ID, 'inner');
    const resultState = removeControlReducer<FormValue>(state, action);
    expect(resultState.value).toEqual({});
    expect(resultState.errors).toEqual(errors);
    expect(resultState.controls.inner).toBeUndefined();
  });

  it('should throw if trying to remove non-existing control', () => {
    const action = new RemoveControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner2');
    expect(() => removeControlReducer<FormGroupValue>(INITIAL_STATE, action)).toThrowError();
  });
});
