import { AddControlAction } from '../../actions';
import { cast, createFormGroupState } from '../../state';
import { addControlReducer } from './add-control';

describe('form group addControlReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; inner5?: string[]; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should create child state', () => {
    const value = 'B';
    const action = new AddControlAction<FormGroupValue, 'inner2'>(FORM_CONTROL_ID, 'inner2', value);
    const resultState = addControlReducer<FormGroupValue>(INITIAL_STATE, action);
    expect(resultState.value).toEqual({ inner: '', inner2: value });
    expect(resultState.controls.inner2.value).toEqual(value);
  });

  it('should create child state for group children', () => {
    const value = { inner4: 'D' };
    const action = new AddControlAction<FormGroupValue, 'inner3'>(FORM_CONTROL_ID, 'inner3', value);
    const resultState = addControlReducer<FormGroupValue>(INITIAL_STATE, action);
    expect(resultState.value).toEqual({ inner: '', inner3: value });
    expect(resultState.controls.inner3.value).toBe(value);
    expect(cast(resultState.controls.inner3)!.controls).toBeDefined();
    expect(Array.isArray(cast(resultState.controls.inner3)!.controls)).toBe(false);
  });

  it('should create child state for array children', () => {
    const value = ['A'];
    const action = new AddControlAction<FormGroupValue, 'inner5'>(FORM_CONTROL_ID, 'inner5', value);
    const resultState = addControlReducer<FormGroupValue>(INITIAL_STATE, action);
    expect(resultState.value).toEqual({ inner: '', inner5: value });
    expect(resultState.controls.inner5.value).toBe(value);
    expect(cast(resultState.controls.inner5)!.controls).toBeDefined();
    expect(Array.isArray(cast(resultState.controls.inner5)!.controls)).toBe(true);
  });

  it('should throw if trying to add existing control', () => {
    const action = new AddControlAction<FormGroupValue, 'inner'>(FORM_CONTROL_ID, 'inner', '');
    expect(() => addControlReducer<FormGroupValue>(INITIAL_STATE, action)).toThrowError();
  });
});
