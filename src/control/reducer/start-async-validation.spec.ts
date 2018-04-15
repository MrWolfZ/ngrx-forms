import { StartAsyncValidationAction } from '../../actions';
import { createFormControlState } from '../../state';
import { startAsyncValidationReducer } from './start-async-validation';

describe(`form control ${startAsyncValidationReducer.name}`, () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any action of the wrong type', () => expect(startAsyncValidationReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state with pending validation', () => {
    const name = 'required';
    const resultState = startAsyncValidationReducer(INITIAL_STATE, new StartAsyncValidationAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([name]);
    expect(resultState.isValidationPending).toBe(true);
  });

  it('should update state with pending validation if validations are already pending', () => {
    const name = 'required';
    const existingName = 'min';
    const state = { ...INITIAL_STATE, pendingValidations: [existingName], isValidationPending: true };
    const resultState = startAsyncValidationReducer(state, new StartAsyncValidationAction(FORM_CONTROL_ID, name));
    expect(resultState.pendingValidations).toEqual([existingName, name]);
    expect(resultState.isValidationPending).toBe(true);
  });

  it('should not update state if validation is already pending', () => {
    const name = 'required';
    const state = { ...INITIAL_STATE, pendingValidations: [name], isValidationPending: true };
    const resultState = startAsyncValidationReducer(state, new StartAsyncValidationAction(FORM_CONTROL_ID, name));
    expect(resultState).toBe(state);
  });
});
