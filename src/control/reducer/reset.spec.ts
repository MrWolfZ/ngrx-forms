import { ResetAction } from '../../actions';
import { createFormControlState } from '../../state';
import { resetReducer } from './reset';

describe(`form control ${resetReducer.name}`, () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any action of the wrong type', () =>
    expect(resetReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should update state if touched', () => {
    const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should update state if submitted', () => {
    const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
    expect(resultState.isTouched).toEqual(false);
    expect(resultState.isUntouched).toEqual(true);
    expect(resultState.isSubmitted).toEqual(false);
    expect(resultState.isUnsubmitted).toEqual(true);
  });

  it('should not update state if pristine and untouched and unsubmitted', () => {
    const resultState = resetReducer(INITIAL_STATE, new ResetAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });
});
