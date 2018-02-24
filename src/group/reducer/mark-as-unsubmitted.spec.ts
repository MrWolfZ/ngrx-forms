import { MarkAsUnsubmittedAction } from '../../actions';
import { cast } from '../../state';
import { markAsUnsubmittedReducer } from './mark-as-unsubmitted';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER2_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  INITIAL_STATE,
  INITIAL_STATE_FULL,
  setPropertiesRecursively,
} from './test-util';

describe(`form group ${markAsUnsubmittedReducer.name}`, () => {
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
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(false);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(true);
  });

  it('should mark group children as unsubmitted', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isSubmitted).toEqual(false);
    expect(resultState.controls.inner3!.isUnsubmitted).toEqual(true);
  });

  it('should mark array children as unsubmitted', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isSubmitted).toEqual(false);
    expect(resultState.controls.inner3!.isUnsubmitted).toEqual(true);
  });

  it('should mark state as unsubmitted if all children are unsubmitted when control child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_FULL,
      [['isSubmitted', true], ['isUnsubmitted', false]],
      FORM_CONTROL_INNER2_ID,
      FORM_CONTROL_INNER3_ID,
      FORM_CONTROL_INNER5_ID,
    ));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should not mark state as unsubmitted if not all children are unsubmitted when control child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as unsubmitted if all children are unsubmitted when group child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_FULL,
      [['isSubmitted', true], ['isUnsubmitted', false]],
      FORM_CONTROL_INNER_ID,
      FORM_CONTROL_INNER2_ID,
      FORM_CONTROL_INNER5_ID,
    ));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should mark state as unsubmitted if all children are unsubmitted when array child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_FULL,
      [['isSubmitted', true], ['isUnsubmitted', false]],
      FORM_CONTROL_INNER_ID,
      FORM_CONTROL_INNER2_ID,
      FORM_CONTROL_INNER3_ID,
    ));
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });
});
