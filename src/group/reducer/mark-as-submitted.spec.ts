import { FormGroupState, createFormGroupState } from '../../state';
import { MarkAsSubmittedAction } from '../../actions';
import { markAsSubmittedReducer } from './mark-as-submitted';

describe('form group markAsSubmittedReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

  it('should update state if unsubmitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should not update state if submitted', () => {
    const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    const resultState = markAsSubmittedReducer(state, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(state);
  });

  it('should mark direct control children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(true);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(false);
  });

  it('should mark direct group children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isSubmitted).toEqual(true);
    expect(resultState.controls.inner3.isUnsubmitted).toEqual(false);
  });

  it('should mark nested children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isSubmitted).toBe(true);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isUnsubmitted).toBe(false);
  });

  it('should mark state as submitted if direct control child is marked as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as submitted if direct group child is marked as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as submitted if nested child is marked as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(true);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(false);
  });
});
