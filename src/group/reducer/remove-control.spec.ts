import { RemoveGroupControlAction } from '../../actions';
import { createFormGroupState } from '../../state';
import { removeControlReducer } from './remove-control';
import { FORM_CONTROL_ID, FormGroupValue, INITIAL_STATE, INITIAL_STATE_FULL } from './test-util';

describe(`form group ${removeControlReducer.name}`, () => {
  it('should remove child state', () => {
    const action = new RemoveGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner2');
    const resultState = removeControlReducer<FormGroupValue>(INITIAL_STATE_FULL, action);
    expect(resultState.value).toEqual({ inner: '', inner3: { inner4: '' }, inner5: [''] });
    expect(resultState.controls.inner2).toBeUndefined();
  });

  it('should remove child state for group children', () => {
    const action = new RemoveGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner3');
    const resultState = removeControlReducer<FormGroupValue>(INITIAL_STATE_FULL, action);
    expect(resultState.value).toEqual({ inner: '', inner2: '', inner5: [''] });
    expect(resultState.controls.inner3).toBeUndefined();
  });

  it('should remove child state for array children', () => {
    const action = new RemoveGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner5');
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
          ...state.controls.inner!,
          errors,
        },
      },
    };
    const action = new RemoveGroupControlAction<FormValue>(id, 'inner');
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
          ...state.controls.inner!,
          errors,
        },
      },
    };
    const action = new RemoveGroupControlAction<FormValue>(id, 'inner');
    const resultState = removeControlReducer<FormValue>(state, action);
    expect(resultState.value).toEqual({});
    expect(resultState.errors).toEqual(errors);
    expect(resultState.controls.inner).toBeUndefined();
  });

  it('should throw if trying to remove non-existing control', () => {
    const action = new RemoveGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner2');
    expect(() => removeControlReducer<FormGroupValue>(INITIAL_STATE, action)).toThrowError();
  });

  it('should foward actions to children', () => {
    const state = createFormGroupState(FORM_CONTROL_ID, { inner: { inner2: '' } });
    const action = new RemoveGroupControlAction<typeof state.value.inner>(state.controls.inner.id, 'inner2');
    const resultState = removeControlReducer(state, action as any);
    expect(resultState.controls.inner.controls.inner2).toBeUndefined();
  });
});
