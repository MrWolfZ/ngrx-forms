import { AddGroupControlAction } from '../../actions';
import { createFormGroupState } from '../../state';
import { addControlReducer } from './add-control';
import { FORM_CONTROL_ID, FormGroupValue, INITIAL_STATE } from './test-util';

describe(`form group ${addControlReducer.name}`, () => {
  it('should create child state for control child', () => {
    const value = 'B';
    const action = new AddGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner2', value);
    const resultState = addControlReducer<FormGroupValue>(INITIAL_STATE, action);
    expect(resultState.value).toEqual({ inner: '', inner2: value });
    expect(resultState.controls.inner2!.value).toEqual(value);
  });

  it('should create child state for group child', () => {
    const value = { inner4: 'D' };
    const action = new AddGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner3', value);
    const resultState = addControlReducer<FormGroupValue>(INITIAL_STATE, action);
    expect(resultState.value).toEqual({ inner: '', inner3: value });
    expect(resultState.controls.inner3!.value).toBe(value);
    expect(resultState.controls.inner3!.controls).toBeDefined();
    expect(Array.isArray(resultState.controls.inner3!.controls)).toBe(false);
  });

  it('should create child state for array child', () => {
    const value = ['A'];
    const action = new AddGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner5', value);
    const resultState = addControlReducer<FormGroupValue>(INITIAL_STATE, action);
    expect(resultState.value).toEqual({ inner: '', inner5: value });
    expect(resultState.controls.inner5!.value).toBe(value);
    expect(resultState.controls.inner5!.controls).toBeDefined();
    expect(Array.isArray(resultState.controls.inner5!.controls)).toBe(true);
  });

  it('should throw if trying to add existing control', () => {
    const action = new AddGroupControlAction<FormGroupValue>(FORM_CONTROL_ID, 'inner', '');
    expect(() => addControlReducer<FormGroupValue>(INITIAL_STATE, action)).toThrowError();
  });

  it('should foward actions to children', () => {
    const state = createFormGroupState<{ inner: { inner2?: string } }>(FORM_CONTROL_ID, { inner: {} });
    const value = 'B';
    const action = new AddGroupControlAction<typeof state.value.inner>(state.controls.inner.id, 'inner2', value);
    const resultState = addControlReducer(state, action as any);
    expect(resultState.controls.inner.controls.inner2!.value).toEqual(value);
  });
});
