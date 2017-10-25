import { createFormGroupState } from '../../state';
import { SetUserDefinedPropertyAction } from '../../actions';
import { setUserDefinedPropertyReducer } from './set-user-defined-property';

describe(`form group ${setUserDefinedPropertyReducer.name}`, () => {
  const FORM_CONTROL_ID = 'test ID';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () =>
    expect(setUserDefinedPropertyReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state user defined properties if different', () => {
    const prop = 'prop';
    const value = 12;
    const resultState = setUserDefinedPropertyReducer(INITIAL_STATE, new SetUserDefinedPropertyAction(FORM_CONTROL_ID, prop, value));
    expect(resultState.userDefinedProperties).toEqual({
      [prop]: value,
    });
  });

  it('should not update state user defined properties if same', () => {
    const prop = 'prop';
    const value = 12;
    const state = { ...INITIAL_STATE, userDefinedProperties: { [prop]: value } };
    const resultState = setUserDefinedPropertyReducer(state, new SetUserDefinedPropertyAction(FORM_CONTROL_ID, prop, value));
    expect(resultState).toBe(state);
  });
});
