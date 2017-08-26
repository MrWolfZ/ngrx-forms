import { FormGroupState, createFormGroupState } from '../../state';
import { MarkAsPristineAction } from '../../actions';
import { markAsPristineReducer } from './mark-as-pristine';

describe('form group markAsPristineReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
  const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
  const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
  interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; }
  const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
  const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' } };
  const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
  const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

  it('should update state if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not update state if pristine', () => {
    const resultState = markAsPristineReducer(INITIAL_STATE, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should mark direct control children as pristine', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isDirty).toEqual(false);
    expect(resultState.controls.inner.isPristine).toEqual(true);
  });

  it('should mark direct group children as pristine', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isDirty).toEqual(false);
    expect(resultState.controls.inner3.isPristine).toEqual(true);
  });

  it('should mark nested children as pristine', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...inner3State,
          isDirty: true,
          isPristine: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isDirty: true,
              isPristine: false,
            },
          },
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isDirty).toBe(false);
    expect((resultState.controls.inner3 as FormGroupState<any>).controls.inner4.isPristine).toBe(true);
  });

  it('should mark state as pristine if all children are pristine when direct control child is updated', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not mark state as pristine if not all children are pristine when direct control child is updated', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isDirty: true,
          isPristine: false,
        },
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as pristine if all children are pristine when direct group child is updated', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...INITIAL_STATE_FULL.controls.inner3,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should mark state as pristine if all children are pristine when nested child is updated', () => {
    const inner3State = INITIAL_STATE_FULL.controls.inner3 as FormGroupState<any>;
    const state = {
      ...INITIAL_STATE_FULL,
      isDirty: true,
      isPristine: false,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner3: {
          ...inner3State,
          isDirty: true,
          isPristine: false,
          controls: {
            ...inner3State.controls,
            inner4: {
              ...inner3State.controls.inner4,
              isDirty: true,
              isPristine: false,
            },
          },
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should forward actions to children', () => {
    const state = {
      ...INITIAL_STATE_FULL,
      controls: {
        ...INITIAL_STATE_FULL.controls,
        inner: {
          ...INITIAL_STATE_FULL.controls.inner,
          isDirty: true,
          isPristine: false,
        },
      },
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isDirty).toEqual(false);
    expect(resultState.controls.inner.isPristine).toEqual(true);
  });
});
