import { FormGroupState, createFormGroupState } from '../../state';
import { MarkAsDirtyAction } from '../../actions';
import { markAsDirtyReducer } from './mark-as-dirty';

describe('form group markAsDirtyReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

  it('should update state if pristine', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should not update state if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = markAsDirtyReducer(state, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toBe(state);
  });

  it('should mark direct control children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isDirty).toEqual(true);
    expect(resultState.controls.inner.isPristine).toEqual(false);
  });

  it('should mark direct group children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isDirty).toEqual(true);
    expect(resultState.controls.inner3.isPristine).toEqual(false);
  });

  it('should mark nested children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDirty).toBe(true);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isPristine).toBe(false);
  });

  it('should mark state as dirty if direct control child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if direct group child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if nested child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isDirty).toEqual(true);
    expect(resultState.controls.inner.isPristine).toEqual(false);
  });
});
