import { reset } from './reset';
import { INITIAL_STATE } from './test-util';

describe(reset.name, () => {
  it('should call reducer for controls if dirty', () => {
    const state = { ...INITIAL_STATE.controls.inner, isDirty: true, isPristine: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for controls if touched', () => {
    const state = { ...INITIAL_STATE.controls.inner, isTouched: true, isUntouched: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for controls if submitted', () => {
    const state = { ...INITIAL_STATE.controls.inner, isSubmitted: true, isUnsubmitted: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups if touched', () => {
    const state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups if submitted', () => {
    const state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays if dirty', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isDirty: true, isPristine: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays if touched', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isTouched: true, isUntouched: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays if submitted', () => {
    const state = { ...INITIAL_STATE.controls.inner5, isSubmitted: true, isUnsubmitted: false };
    const resultState = reset(state);
    expect(resultState).not.toBe(state);
  });
});
