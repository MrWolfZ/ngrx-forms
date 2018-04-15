import { MarkAsUnsubmittedAction } from '../../actions';
import { createFormControlState } from '../../state';
import { markAsUnsubmittedReducer } from './mark-as-unsubmitted';

describe('form control markAsUnsubmittedReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () =>
    expect(markAsUnsubmittedReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  describe(MarkAsUnsubmittedAction.name, () => {
    it('should update state if submitted', () => {
      const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      const resultState = markAsUnsubmittedReducer(state, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState.isSubmitted).toEqual(false);
      expect(resultState.isUnsubmitted).toEqual(true);
    });

    it('should not update state if unsubmitted', () => {
      const resultState = markAsUnsubmittedReducer(INITIAL_STATE, new MarkAsUnsubmittedAction(FORM_CONTROL_ID));
      expect(resultState).toBe(INITIAL_STATE);
    });
  });
});
