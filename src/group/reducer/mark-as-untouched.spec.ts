import { MarkAsUntouchedAction } from '../../actions';
import { cast, createFormGroupState } from '../../state';
import { markAsUntouchedReducer } from './mark-as-untouched';

describe('form group markAsUntouchedReducer', () => {
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
    const inner3State = cast(INITIAL_STATE_FULL.controls.inner3)!;
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
    expect(resultState.controls.inner3.isTouched).toEqual(false);
    expect(resultState.controls.inner3.isUntouched).toEqual(true);
  });

  it('should mark direct array children as untouched', () => {
    const inner5State = cast(INITIAL_STATE_FULL.controls.inner5)!;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner5: {
          ...inner5State,
          isTouched: true,
          isUntouched: false,
          controls: [
            {
              ...inner5State.controls[0],
              isTouched: true,
              isUntouched: false,
            },
          ],
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isTouched).toEqual(false);
    expect(resultState.controls.inner5.isUntouched).toEqual(true);
  });

  it('should mark nested children in group as untouched', () => {
    const inner3State = cast(INITIAL_STATE_FULL.controls.inner3)!;
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
    expect(cast(resultState.controls.inner3)!.controls.inner4.isTouched).toBe(false);
    expect(cast(resultState.controls.inner3)!.controls.inner4.isUntouched).toBe(true);
  });

  it('should mark nested children in array as untouched', () => {
    const inner5State = cast(INITIAL_STATE_FULL.controls.inner5)!;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner5: {
          ...inner5State,
          isTouched: true,
          isUntouched: false,
          controls: [
            {
              ...inner5State.controls[0],
              isTouched: true,
              isUntouched: false,
            },
          ],
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner5)!.controls[0].isTouched).toBe(false);
    expect(cast(resultState.controls.inner5)!.controls[0].isUntouched).toBe(true);
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
    const inner3State = cast(INITIAL_STATE_FULL.controls.inner3)!;
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
    const inner3State = cast(INITIAL_STATE_FULL.controls.inner3)!;
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
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should mark state as untouched if all children are untouched when direct array child is updated', () => {
    const inner5State = cast(INITIAL_STATE_FULL.controls.inner5)!;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner5: {
          ...inner5State,
          isTouched: true,
          isUntouched: false,
          controls: [
            {
              ...inner5State.controls[0],
              isTouched: true,
              isUntouched: false,
            },
          ],
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
  });

  it('should mark state as untouched if all children are untouched when nested child in group is updated', () => {
    const inner3State = cast(INITIAL_STATE_FULL.controls.inner3)!;
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

  it('should mark state as untouched if all children are untouched when nested child in array is updated', () => {
    const inner5State = cast(INITIAL_STATE_FULL.controls.inner5)!;
    const state = {
      ...INITIAL_STATE_FULL,
      isTouched: true,
      isUntouched: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner5: {
          ...inner5State,
          isTouched: true,
          isUntouched: false,
          controls: [
            {
              ...inner5State.controls[0],
              isTouched: true,
              isUntouched: false,
            },
          ],
        },
      },
    };
    const resultState = markAsUntouchedReducer(state, new MarkAsUntouchedAction(FORM_CONTROL_INNER5_0_ID));
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
