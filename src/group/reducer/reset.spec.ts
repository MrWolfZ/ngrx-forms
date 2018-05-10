import { ResetAction } from '../../actions';
import { resetReducer } from './reset';
import { FORM_CONTROL_ID, INITIAL_STATE, INITIAL_STATE_FULL, setPropertiesRecursively } from './test-util';

describe(`form group ${resetReducer.name}`, () => {
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

  it('should reset control children', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]);
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isDirty).toEqual(false);
    expect(resultState.controls.inner.isPristine).toEqual(true);
  });

  it('should reset group children', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]);
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isDirty).toEqual(false);
    expect(resultState.controls.inner3!.isPristine).toEqual(true);
  });

  it('should reset array children', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]);
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5!.isDirty).toEqual(false);
    expect(resultState.controls.inner5!.isPristine).toEqual(true);
  });

  it('should forward actions to children', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isDirty', true], ['isPristine', false]]);
    const resultState = resetReducer(state, new ResetAction(state.controls.inner.id));
    expect(resultState).not.toBe(state);
  });
});
