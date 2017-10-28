import { MarkAsSubmittedAction } from '../../actions';
import { cast, createFormGroupState } from '../../state';
import { markAsSubmittedReducer } from './mark-as-submitted';

describe('form group markAsSubmittedReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  const FORM_CONTROL_INNER5_ID = FORM_CONTROL_ID + '.inner5';
  const FORM_CONTROL_INNER5_0_ID = FORM_CONTROL_ID + '.inner5.0';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; inner5?: string[]; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' }, inner5: [''] };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);
  const INITIAL_STATE_FULL_INNER3 = cast(INITIAL_STATE_FULL.controls.inner3)!;
  const INITIAL_STATE_FULL_INNER5 = cast(INITIAL_STATE_FULL.controls.inner5)!;
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
      inner5: {
        ...INITIAL_STATE_FULL_INNER5,
        isSubmitted: true,
        isUnsubmitted: false,
        controls: [
          {
            ...INITIAL_STATE_FULL_INNER5.controls[0],
            isSubmitted: true,
            isUnsubmitted: false,
          },
        ],
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

  it('should mark direct array children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isSubmitted).toEqual(true);
    expect(resultState.controls.inner5.isUnsubmitted).toEqual(false);
  });

  it('should mark nested children in group as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner3)!.controls.inner4.isSubmitted).toBe(true);
    expect(cast(resultState.controls.inner3)!.controls.inner4.isUnsubmitted).toBe(false);
  });

  it('should mark nested children in array as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner5)!.controls[0].isSubmitted).toBe(true);
    expect(cast(resultState.controls.inner5)!.controls[0].isUnsubmitted).toBe(false);
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

  it('should mark state as submitted if direct array child is marked as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as submitted if nested child in group is marked as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as submitted if nested child in array is marked as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_INNER5_0_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(true);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(false);
  });
});
