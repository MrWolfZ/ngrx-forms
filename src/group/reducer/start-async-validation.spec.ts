import { StartAsyncValidationAction } from '../../actions';
import { startAsyncValidationReducer } from './start-async-validation';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  INITIAL_STATE,
  INITIAL_STATE_FULL,
} from './test-util';

describe(`form group ${startAsyncValidationReducer.name}`, () => {
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

  it('should not update state if validation is already pending', () => {
    const name = 'required';
    const state = { ...INITIAL_STATE, pendingValidations: [name], isValidationPending: true };
    const resultState = startAsyncValidationReducer(state, new StartAsyncValidationAction(FORM_CONTROL_ID, name));
    expect(resultState).toBe(state);
  });

  it('should mark state as having validation pending if control child is marked as having validation pending', () => {
    const name = 'required';
    const resultState = startAsyncValidationReducer(INITIAL_STATE, new StartAsyncValidationAction(FORM_CONTROL_INNER_ID, name));
    expect(resultState.isValidationPending).toEqual(true);
  });

  it('should mark state as having validation pending if group child is marked as having validation pending', () => {
    const name = 'required';
    const resultState = startAsyncValidationReducer(INITIAL_STATE_FULL, new StartAsyncValidationAction(FORM_CONTROL_INNER3_ID, name));
    expect(resultState.isValidationPending).toEqual(true);
  });

  it('should mark state as having validation pending if array child is marked as having validation pending', () => {
    const name = 'required';
    const resultState = startAsyncValidationReducer(INITIAL_STATE_FULL, new StartAsyncValidationAction(FORM_CONTROL_INNER5_ID, name));
    expect(resultState.isValidationPending).toEqual(true);
  });
});
