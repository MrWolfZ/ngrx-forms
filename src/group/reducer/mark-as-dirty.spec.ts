import { MarkAsDirtyAction } from '../../actions';
import { cast, createFormGroupState, FormGroupState } from '../../state';
import { markAsDirtyReducer } from './mark-as-dirty';

describe('form group markAsDirtyReducer', () => {
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
  const INITIAL_STATE_FULL_DIRTY = {
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
      inner2: {
        ...INITIAL_STATE_FULL.controls.inner2,
        isDirty: true,
        isPristine: false,
      },
      inner3: {
        ...INITIAL_STATE_FULL_INNER3,
        isDirty: true,
        isPristine: false,
        controls: {
          ...INITIAL_STATE_FULL_INNER3.controls,
          inner4: {
            ...INITIAL_STATE_FULL_INNER3.controls.inner4,
            isDirty: true,
            isPristine: false,
          },
        },
      },
      inner5: {
        ...INITIAL_STATE_FULL_INNER5,
        isDirty: true,
        isPristine: false,
        controls: [
          {
            ...INITIAL_STATE_FULL_INNER5.controls[0],
            isDirty: true,
            isPristine: false,
          },
        ],
      },
    },
  };

  it('should mark itself and all children recursively as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_DIRTY);
  });

  it('should not update state if all children are marked as dirty recursively', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL_DIRTY, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_FULL_DIRTY);
  });

  it('should mark children as dirty if the group itself is already marked as dirty', () => {
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
      },
    };
    const resultState = markAsDirtyReducer(state, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_DIRTY);
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

  it('should mark direct array children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isDirty).toEqual(true);
    expect(resultState.controls.inner5.isPristine).toEqual(false);
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

  it('should mark state as dirty if direct array child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if nested child in group is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if nested child in array is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_FULL, new MarkAsDirtyAction(FORM_CONTROL_INNER5_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isDirty).toEqual(true);
    expect(resultState.controls.inner.isPristine).toEqual(false);
  });
});
