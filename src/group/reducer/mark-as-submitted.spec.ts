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
  const INITIAL_STATE_FULL_INNER3 = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
  const INITIAL_STATE_FULL_SUBMITTED = {
    ...INITIAL_STATE_FULL,
    isSubmitted: true,
    isUnsubmitted: false,
    controls: {
      ...INITIAL_STATE_FULL.controls,
      inner: {
        ...INITIAL_STATE_FULL.controls.inner,
        isSubmitted: true,
        isUnsubmitted: false,
      },
      inner2: {
        ...INITIAL_STATE_FULL.controls.inner2,
        isSubmitted: true,
        isUnsubmitted: false,
      },
      inner3: {
        ...INITIAL_STATE_FULL_INNER3,
        isSubmitted: true,
        isUnsubmitted: false,
        controls: {
          ...INITIAL_STATE_FULL_INNER3.controls,
          inner4: {
            ...INITIAL_STATE_FULL_INNER3.controls.inner4,
            isSubmitted: true,
            isUnsubmitted: false,
          },
        },
      },
    },
  };

  it('should mark itself and all children recursively as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_SUBMITTED);
  });

  it('should not update state if all children are marked as submitted recursively', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL_SUBMITTED, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_FULL_SUBMITTED);
  });

  it('should mark children as submitted if the group itself is already marked as submitted', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isSubmitted: true,
          isUnsubmitted: false,
        },
      },
    };
    const resultState = markAsSubmittedReducer(state, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_SUBMITTED);
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
