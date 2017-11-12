import { ResetAction } from '../../actions';
import { cast } from '../../state';
import { resetReducer } from './reset';
import {
  FORM_CONTROL_0_ID,
  FORM_CONTROL_1_ID,
  FORM_CONTROL_ID,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
  setPropertiesRecursively,
} from './test-util';

describe(`form array ${resetReducer.name}`, () => {
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
    const state = cast(setPropertiesRecursively(INITIAL_STATE, [['isDirty', true], ['isPristine', false]]));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });

  it('should reset group children', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_NESTED_GROUP, [['isDirty', true], ['isPristine', false]]));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });

  it('should reset array children', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_NESTED_ARRAY, [['isDirty', true], ['isPristine', false]]));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });

  it('should reset state if all children are reset when control child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE,
      [['isDirty', true], ['isPristine', false], ['isTouched', true], ['isUntouched', false], ['isSubmitted', true], ['isUnsubmitted', false]],
      FORM_CONTROL_0_ID,
    ));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_1_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not reset state if not all children are reset when control child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE, [['isDirty', true], ['isPristine', false]]));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should reset state if all children are reset when group child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_NESTED_GROUP,
      [['isDirty', true], ['isPristine', false], ['isTouched', true], ['isUntouched', false], ['isSubmitted', true], ['isUnsubmitted', false]],
      FORM_CONTROL_0_ID,
    ));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_1_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should reset state if all children are reset when array child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_NESTED_ARRAY,
      [['isDirty', true], ['isPristine', false], ['isTouched', true], ['isUntouched', false], ['isSubmitted', true], ['isUnsubmitted', false]],
      FORM_CONTROL_0_ID,
    ));
    const resultState = resetReducer(state, new ResetAction(FORM_CONTROL_1_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });
});
