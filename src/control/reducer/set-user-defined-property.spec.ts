import { SetUserDefinedPropertyAction } from '../../actions';
import { createFormControlState } from '../../state';
import { setUserDefinedPropertyReducer } from './set-user-defined-property';

describe('form control setUserDefinedPropertyReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

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

  it('should not affect other custom properties', () => {
    const prop = 'prop';
    const prop2 = 'prop2';
    const value = 12;
    const value2 = 13;
    const state = { ...INITIAL_STATE, userDefinedProperties: { [prop]: value } };
    const resultState = setUserDefinedPropertyReducer(state, new SetUserDefinedPropertyAction(FORM_CONTROL_ID, prop2, value2));
    expect(resultState.userDefinedProperties).toEqual({
      [prop]: value,
      [prop2]: value2,
    });
  });
});
