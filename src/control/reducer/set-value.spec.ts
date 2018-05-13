import { SetValueAction } from '../../actions';
import { box } from '../../boxing';
import { createFormControlState } from '../../state';
import { setValueReducer } from './set-value';

describe('form control setValueReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () => expect(setValueReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state value if different', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
  });

  it('should not update state value if same', () => {
    const value = 'A';
    const state = { ...INITIAL_STATE, value };
    const resultState = setValueReducer(state, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState).toBe(state);
  });

  it('should not mark state as dirty', () => {
    const value = 'A';
    const resultState = setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.isDirty).toEqual(false);
  });

  it('should throw for date values', () => {
    const value = new Date(1970, 0, 1);
    const state = createFormControlState(FORM_CONTROL_ID, null);
    expect(() => setValueReducer<any>(state, new SetValueAction(FORM_CONTROL_ID, value))).toThrowError();
  });

  it('should throw if value is not supported', () => {
    const value = {};
    expect(() => setValueReducer<any>(INITIAL_STATE, new SetValueAction<{}>(FORM_CONTROL_ID, value))).toThrowError();
  });

  it('should allow setting boxed object values', () => {
    const state = createFormControlState(FORM_CONTROL_ID, box({ inner: '' }));
    const value = box({ inner: 'A' });
    const resultState = setValueReducer(state, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
  });

  it('should allow setting boxed array values', () => {
    const state = createFormControlState(FORM_CONTROL_ID, box(['']));
    const value = box(['A']);
    const resultState = setValueReducer(state, new SetValueAction(FORM_CONTROL_ID, value));
    expect(resultState.value).toEqual(value);
  });

  it('should throw if boxed value is not serializable', () => {
    const value = box({ inner: () => void 0 });
    expect(() => setValueReducer(INITIAL_STATE, new SetValueAction(FORM_CONTROL_ID, value as any))).toThrowError();
  });
});
