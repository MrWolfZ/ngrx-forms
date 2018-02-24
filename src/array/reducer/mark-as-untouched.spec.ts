import { MarkAsUntouchedAction } from '../../actions';
import { markAsUntouchedReducer } from './mark-as-untouched';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_1_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${markAsUntouchedReducer.name}`, () => {
  it('should update state if touched', () => {
    const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should not update state if untouched', () => {
    const resultState = markAsUntouchedReducer(INITIAL_STATE, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should mark control children as untouched', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isTouched', true], ['isUntouched', false]]);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isTouched).toEqual(false);
    expect(resultState.controls[0].isUntouched).toEqual(true);
  });

  it('should mark group children as untouched', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_NESTED_GROUP, [['isTouched', true], ['isUntouched', false]]);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isTouched).toEqual(false);
    expect(resultState.controls[0].isUntouched).toEqual(true);
  });

  it('should mark array children as untouched', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_NESTED_ARRAY, [['isTouched', true], ['isUntouched', false]]);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isTouched).toEqual(false);
    expect(resultState.controls[0].isUntouched).toEqual(true);
  });

  it('should mark state as untouched if all children are pristine when control child is updated', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isTouched', true], ['isUntouched', false]], FORM_CONTROL_0_ID);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_1_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should not mark state as untouched if not all children are pristine when control child is updated', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isTouched', true], ['isUntouched', false]]);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_0_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should mark state as untouched if all children are pristine when group child is updated', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_NESTED_GROUP, [['isTouched', true], ['isUntouched', false]], FORM_CONTROL_0_ID);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_1_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should mark state as untouched if all children are pristine when array child is updated', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_NESTED_ARRAY, [['isTouched', true], ['isUntouched', false]], FORM_CONTROL_0_ID);
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_1_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });
});
