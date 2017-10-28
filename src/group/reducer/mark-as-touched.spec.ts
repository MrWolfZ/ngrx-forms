import { MarkAsTouchedAction } from '../../actions';
import { cast, createFormGroupState } from '../../state';
import { markAsTouchedReducer } from './mark-as-touched';

describe('form group markAsTouchedReducer', () => {
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
  const INITIAL_STATE_FULL_TOUCHED = {
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
      inner2: {
        ...INITIAL_STATE_FULL.controls.inner2,
        isTouched: true,
        isUntouched: false,
      },
      inner3: {
        ...INITIAL_STATE_FULL_INNER3,
        isTouched: true,
        isUntouched: false,
        controls: {
          ...INITIAL_STATE_FULL_INNER3.controls,
          inner4: {
            ...INITIAL_STATE_FULL_INNER3.controls.inner4,
            isTouched: true,
            isUntouched: false,
          },
        },
      },
      inner5: {
        ...INITIAL_STATE_FULL_INNER5,
        isTouched: true,
        isUntouched: false,
        controls: [
          {
            ...INITIAL_STATE_FULL_INNER5.controls[0],
            isTouched: true,
            isUntouched: false,
          },
        ],
      },
    },
  };

  it('should mark itself and all children recursively as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_TOUCHED);
  });

  it('should not update state if all children are marked as touched recursively', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL_TOUCHED, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_FULL_TOUCHED);
  });

  it('should mark children as touched if the group itself is already marked as touched', () => {
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
      },
    };
    const resultState = markAsTouchedReducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_TOUCHED);
  });

  it('should mark direct control children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isTouched).toEqual(true);
    expect(resultState.controls.inner.isUntouched).toEqual(false);
  });

  it('should mark direct group children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isTouched).toEqual(true);
    expect(resultState.controls.inner3.isUntouched).toEqual(false);
  });

  it('should mark direct array children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isTouched).toEqual(true);
    expect(resultState.controls.inner5.isUntouched).toEqual(false);
  });

  it('should mark nested children in group as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner3)!.controls.inner4.isTouched).toBe(true);
    expect(cast(resultState.controls.inner3)!.controls.inner4.isUntouched).toBe(false);
  });

  it('should mark nested children in array as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(cast(resultState.controls.inner5)!.controls[0].isTouched).toBe(true);
    expect(cast(resultState.controls.inner5)!.controls[0].isUntouched).toBe(false);
  });

  it('should mark state as touched if direct control child is marked as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should mark state as touched if direct group child is marked as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should mark state as touched if direct array child is marked as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should mark state as touched if nested child in group is marked as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_INNER4_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should mark state as touched if nested child in array is marked as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_INNER5_0_ID));
    expect(resultState.isTouched).toEqual(true);
    expect(resultState.isUntouched).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.controls.inner.isTouched).toEqual(true);
    expect(resultState.controls.inner.isUntouched).toEqual(false);
  });
});
