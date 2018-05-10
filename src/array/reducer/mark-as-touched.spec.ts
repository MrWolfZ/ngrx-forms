import { MarkAsTouchedAction } from '../../actions';
import { markAsTouchedReducer } from './mark-as-touched';
import {
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${markAsTouchedReducer.name}`, () => {
  const INITIAL_STATE_TOUCHED = setPropertiesRecursively(INITIAL_STATE, [['isTouched', true], ['isUntouched', false]]);

  it('should mark itself and all children recursively as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_TOUCHED);
  });

  it('should not update state if all children are marked as touched recursively', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_TOUCHED, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_TOUCHED);
  });

  it('should mark children as touched if the group itself is already marked as touched', () => {
    const state = {
      ...INITIAL_STATE,
      isTouched: true,
      isUntouched: false,
      controls: [
        INITIAL_STATE.controls[0],
        {
          ...INITIAL_STATE.controls[1],
          isTouched: true,
          isUntouched: false,
        },
      ],
    };
    const resultState = markAsTouchedReducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_TOUCHED);
  });

  it('should mark control children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isTouched).toEqual(true);
    expect(resultState.controls[0].isUntouched).toEqual(false);
  });

  it('should mark group children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_NESTED_GROUP, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isTouched).toEqual(true);
    expect(resultState.controls[0].isUntouched).toEqual(false);
  });

  it('should mark array children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_NESTED_ARRAY, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isTouched).toEqual(true);
    expect(resultState.controls[0].isUntouched).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(INITIAL_STATE.controls[0].id));
    expect(resultState).not.toBe(INITIAL_STATE);
  });
});
