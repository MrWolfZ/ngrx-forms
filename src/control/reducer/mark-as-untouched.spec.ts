import { MarkAsUntouchedAction } from '../../actions';
import { createFormControlState } from '../../state';
import { markAsUntouchedReducer } from './mark-as-untouched';

describe('form control markAsUntouchedReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () =>
    expect(markAsUntouchedReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

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
});
