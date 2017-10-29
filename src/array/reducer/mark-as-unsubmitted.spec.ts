import { MarkAsUnsubmittedAction } from '../../actions';
import { cast } from '../../state';
import { markAsUnsubmittedReducer } from './mark-as-unsubmitted';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_1_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${markAsUnsubmittedReducer.name}`, () => {
  it('should update state if submitted', () => {
    const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should not update state if unsubmitted', () => {
    const resultState = markAsUnsubmittedReducer(INITIAL_STATE, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should mark control children as unsubmitted', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isSubmitted).toEqual(false);
    expect(resultState.controls[0].isUnsubmitted).toEqual(true);
  });

  it('should mark group children as unsubmitted', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_NESTED_GROUP, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isSubmitted).toEqual(false);
    expect(resultState.controls[0].isUnsubmitted).toEqual(true);
  });

  it('should mark array children as unsubmitted', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_NESTED_ARRAY, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isSubmitted).toEqual(false);
    expect(resultState.controls[0].isUnsubmitted).toEqual(true);
  });

  it('should mark state as unsubmitted if all children are pristine when control child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE, [['isSubmitted', true], ['isUnsubmitted', false]], FORM_CONTROL_0_ID));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_1_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should not mark state as unsubmitted if not all children are pristine when control child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_0_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as unsubmitted if all children are pristine when group child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_NESTED_GROUP, [['isSubmitted', true], ['isUnsubmitted', false]], FORM_CONTROL_0_ID));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_1_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should mark state as unsubmitted if all children are pristine when array child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_NESTED_ARRAY, [['isSubmitted', true], ['isUnsubmitted', false]], FORM_CONTROL_0_ID));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_1_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });
});
