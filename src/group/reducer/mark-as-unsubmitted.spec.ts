import { FormGroupState, createFormGroupState } from '../../state';
import { MarkAsUnsubmittedAction } from '../../actions';
import { markAsUnsubmittedReducer } from './mark-as-unsubmitted';

describe('form group markAsUnsubmittedReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

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

  it('should mark direct control children as unsubmitted', () => {
    const state = {
      ...INITIAL_STATE,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isSubmitted: true,
          isUnsubmitted: false,
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(false);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(true);
  });

  it('should mark direct group children as unsubmitted', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isSubmitted: true,
          isUnsubmitted: false,
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isSubmitted).toEqual(false);
    expect(resultState.controls.inner3.isUnsubmitted).toEqual(true);
  });

  it('should mark nested children as unsubmitted', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...inner3State,
          isSubmitted: true,
          isUnsubmitted: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isSubmitted: true,
              isUnsubmitted: false,
            },
          },
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isSubmitted).toBe(false);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isUnsubmitted).toBe(true);
  });

  it('should mark state as unsubmitted if all children are unsubmitted when direct control child is updated', () => {
    const state = {
      ...INITIAL_STATE,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isSubmitted: true,
          isUnsubmitted: false,
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should not mark state as unsubmitted if not all children are unsubmitted when direct control child is updated', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
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
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isSubmitted: true,
          isUnsubmitted: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isSubmitted: true,
              isUnsubmitted: false,
            },
          },
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isSubmitted).toEqual(true);
    expect(resultState.isUnsubmitted).toEqual(false);
  });

  it('should mark state as unsubmitted if all children are unsubmitted when direct group child is updated', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isSubmitted: true,
          isUnsubmitted: false,
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should mark state as unsubmitted if all children are unsubmitted when nested child is updated', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isSubmitted: true,
      isUnsubmitted: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...inner3State,
          isSubmitted: true,
          isUnsubmitted: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isSubmitted: true,
              isUnsubmitted: false,
            },
          },
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should forward actions to children', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isSubmitted: true,
          isUnsubmitted: false,
        },
      },
    };
    const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(false);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(true);
  });
});
