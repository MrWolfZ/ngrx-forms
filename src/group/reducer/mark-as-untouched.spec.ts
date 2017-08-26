import { FormGroupState, createFormGroupState } from '../../state';
import { MarkAsUntouchedAction } from '../../actions';
import { markAsUntouchedReducer } from './mark-as-untouched';

describe('form group markAsUntouchedReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

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

  it('should mark direct control children as untouched', () => {
    const state = {
      ...INITIAL_STATE,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isTouched: true,
          isUntouched: false,
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isTouched).toEqual(false);
    expect(resultState.controls.inner.isUntouched).toEqual(true);
  });

  it('should mark direct group children as untouched', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isTouched: true,
          isUntouched: false,
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isTouched).toEqual(false);
    expect(resultState.controls.inner3.isUntouched).toEqual(true);
  });

  it('should mark nested children as untouched', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...inner3State,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isTouched: true,
              isUntouched: false,
            },
          },
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isTouched).toBe(false);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isUntouched).toBe(true);
  });

  it('should mark state as untouched if all children are untouched when direct control child is updated', () => {
    const state = {
      ...INITIAL_STATE,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isTouched: true,
          isUntouched: false,
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should not mark state as untouched if not all children are untouched when direct control child is updated', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isTouched: true,
          isUntouched: false,
        },
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isTouched: true,
              isUntouched: false,
            },
          },
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should mark state as untouched if all children are untouched when direct group child is updated', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isTouched: true,
          isUntouched: false,
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should mark state as untouched if all children are untouched when nested child is updated', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...inner3State,
          isTouched: true,
          isUntouched: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isTouched: true,
              isUntouched: false,
            },
          },
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should forward actions to children', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isTouched: true,
          isUntouched: false,
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isTouched).toEqual(false);
    expect(resultState.controls.inner.isUntouched).toEqual(true);
  });
});
