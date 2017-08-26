import { createFormGroupState } from '../../state';
import { AddControlAction } from '../../actions';
import { addControlReducer } from './add-control';

describe('form group addControlReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
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
  });

  it('should throw if trying to add existing control', () => {
    const action = new AddControlAction<FormGroupValue, 'inner'>(FORM_CONTROL_ID, 'inner', '');
    expect(() => addControlReducer<FormGroupValue>(INITIAL_STATE, action)).toThrowError();
  });
});
