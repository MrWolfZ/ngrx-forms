import { SetUserDefinedPropertyAction } from '../../actions';
import { setUserDefinedPropertyReducer } from './set-user-defined-property';
import { FORM_CONTROL_0_ID, FORM_CONTROL_ID, INITIAL_STATE } from './test-util';

describe(`form group ${setUserDefinedPropertyReducer.name}`, () => {
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

  it('should update state user defined properties for children', () => {
    const prop = 'prop';
    const value = 12;
    const resultState = setUserDefinedPropertyReducer(INITIAL_STATE, new SetUserDefinedPropertyAction(FORM_CONTROL_0_ID, prop, value));
    expect(resultState.controls[0].userDefinedProperties).toEqual({
      [prop]: value,
    });
  });
});
