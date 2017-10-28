import { MarkAsDirtyAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { markAsDirtyReducer } from './mark-as-dirty';

describe('form group markAsDirtyReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_0_ID = FORM_CONTROL_ID + '.0';
  const FORM_CONTROL_1_ID = FORM_CONTROL_ID + '.1';
  const INITIAL_FORM_ARRAY_VALUE = ['', ''];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: '' }];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [['']];
  const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
  const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
  const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);
  const INITIAL_STATE_DIRTY = {
    ...INITIAL_STATE,
    isDirty: true,
    isPristine: false,
    controls: [
      {
        ...INITIAL_STATE.controls[0],
        isDirty: true,
        isPristine: false,
      },
      {
        ...INITIAL_STATE.controls[1],
        isDirty: true,
        isPristine: false,
      },
    ],
  };

  it('should mark itself and all children recursively as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_DIRTY);
  });

  it('should not update state if all children are marked as dirty recursively', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_DIRTY, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_DIRTY);
  });

  it('should mark children as dirty if the group itself is already marked as dirty', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: [
        INITIAL_STATE.controls[0],
        {
          ...INITIAL_STATE.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsDirtyReducer(state, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_DIRTY);
  });

  it('should mark control children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(true);
    expect(resultState.controls[0].isPristine).toEqual(false);
  });

  it('should mark group children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_NESTED_GROUP, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(true);
    expect(resultState.controls[0].isPristine).toEqual(false);
  });

  it('should mark array children as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_NESTED_ARRAY, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(true);
    expect(resultState.controls[0].isPristine).toEqual(false);
  });

  it('should mark state as dirty if direct control child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if direct group child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_NESTED_GROUP, new MarkAsDirtyAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as dirty if direct array child is marked as dirty', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE_NESTED_ARRAY, new MarkAsDirtyAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_0_ID));
    expect(resultState.controls[0].isDirty).toEqual(true);
    expect(resultState.controls[0].isPristine).toEqual(false);
  });
});
