import { MarkAsDirtyAction } from '../../actions';
import { markAsDirtyReducer } from './mark-as-dirty';
import {
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${markAsDirtyReducer.name}`, () => {
  const INITIAL_STATE_DIRTY = setPropertiesRecursively(INITIAL_STATE, [['isDirty', true], ['isPristine', false]]);

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

  it('should forward actions to children', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(INITIAL_STATE.controls[0].id));
    expect(resultState).not.toBe(INITIAL_STATE);
  });
});
