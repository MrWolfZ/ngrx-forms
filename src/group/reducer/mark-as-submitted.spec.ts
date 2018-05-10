import { MarkAsSubmittedAction } from '../../actions';
import { markAsSubmittedReducer } from './mark-as-submitted';
import { FORM_CONTROL_ID, INITIAL_STATE, INITIAL_STATE_FULL, setPropertiesRecursively } from './test-util';

describe(`form group ${markAsSubmittedReducer.name}`, () => {
  const INITIAL_STATE_FULL_SUBMITTED = setPropertiesRecursively(INITIAL_STATE_FULL, [['isSubmitted', true], ['isUnsubmitted', false]]);

  it('should mark itself and all children recursively as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_SUBMITTED);
  });

  it('should not update state if all children are marked as submitted recursively', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL_SUBMITTED, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE_FULL_SUBMITTED);
  });

  it('should mark children as submitted if the group itself is already marked as submitted', () => {
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
      },
    };
    const resultState = markAsSubmittedReducer(state, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState).toEqual(INITIAL_STATE_FULL_SUBMITTED);
  });

  it('should mark control children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isSubmitted).toEqual(true);
    expect(resultState.controls.inner.isUnsubmitted).toEqual(false);
  });

  it('should mark group children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isSubmitted).toEqual(true);
    expect(resultState.controls.inner3!.isUnsubmitted).toEqual(false);
  });

  it('should mark array children as submitted', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE_FULL, new MarkAsSubmittedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5!.isSubmitted).toEqual(true);
    expect(resultState.controls.inner5!.isUnsubmitted).toEqual(false);
  });

  it('should forward actions to children', () => {
    const resultState = markAsSubmittedReducer(INITIAL_STATE, new MarkAsSubmittedAction(INITIAL_STATE.controls.inner.id));
    expect(resultState).not.toBe(INITIAL_STATE);
  });
});
