import { MarkAsUnsubmittedAction } from '../../actions';
import { markAsUnsubmittedReducer } from './mark-as-unsubmitted';
import { FORM_CONTROL_ID, INITIAL_STATE, INITIAL_STATE_FULL, setPropertiesRecursively } from './test-util';

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
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]);
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(false);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(true);
  });

  it('should mark group children as unsubmitted', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]);
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isSubmitted).toEqual(false);
    expect(resultState.controls.inner3!.isUnsubmitted).toEqual(true);
  });

  it('should mark array children as unsubmitted', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]);
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isSubmitted).toEqual(false);
    expect(resultState.controls.inner3!.isUnsubmitted).toEqual(true);
  });

  it('should forward actions to children', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isSubmitted', true], ['isUnsubmitted', false]]);
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(state.controls.inner.id));
    expect(resultState).not.toBe(state);
  });
});
