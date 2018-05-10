import { MarkAsTouchedAction } from '../../actions';
import { markAsTouchedReducer } from './mark-as-touched';
import { FORM_CONTROL_ID, INITIAL_STATE, INITIAL_STATE_FULL, setPropertiesRecursively } from './test-util';

describe(`form group ${markAsTouchedReducer.name}`, () => {
  const INITIAL_STATE_FULL_TOUCHED = setPropertiesRecursively(INITIAL_STATE_FULL, [['isTouched', true], ['isUntouched', false]]);

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

  it('should mark control children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isTouched).toEqual(true);
    expect(resultState.controls.inner.isUntouched).toEqual(false);
  });

  it('should mark group children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isTouched).toEqual(true);
    expect(resultState.controls.inner3!.isUntouched).toEqual(false);
  });

  it('should mark array children as touched', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE_FULL, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5!.isTouched).toEqual(true);
    expect(resultState.controls.inner5!.isUntouched).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsTouchedReducer(INITIAL_STATE, new MarkAsTouchedAction(INITIAL_STATE.controls.inner.id));
    expect(resultState).not.toBe(INITIAL_STATE);
  });
});
