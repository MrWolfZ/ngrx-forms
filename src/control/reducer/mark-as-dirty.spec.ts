import { MarkAsDirtyAction } from '../../actions';
import { createFormControlState } from '../../state';
import { markAsDirtyReducer } from './mark-as-dirty';

describe('form control markAsDirtyReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () =>
    expect(markAsDirtyReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state if pristine', () => {
    const resultState = markAsDirtyReducer(INITIAL_STATE, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should not update state if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = markAsDirtyReducer(state, new MarkAsDirtyAction(FORM_CONTROL_ID));
    expect(resultState).toBe(state);
  });
});
