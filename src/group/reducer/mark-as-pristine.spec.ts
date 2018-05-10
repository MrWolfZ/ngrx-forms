import { MarkAsPristineAction } from '../../actions';
import { markAsPristineReducer } from './mark-as-pristine';
import { FORM_CONTROL_ID, INITIAL_STATE, INITIAL_STATE_FULL, setPropertiesRecursively } from './test-util';

describe(`form group ${markAsPristineReducer.name}`, () => {
  it('should update state if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not update state if pristine', () => {
    const resultState = markAsPristineReducer(INITIAL_STATE, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should mark control children as pristine', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]);
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isDirty).toEqual(false);
    expect(resultState.controls.inner.isPristine).toEqual(true);
  });

  it('should mark group children as pristine', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]);
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3!.isDirty).toEqual(false);
    expect(resultState.controls.inner3!.isPristine).toEqual(true);
  });

  it('should mark array children as pristine', () => {
    const state = setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]);
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5!.isDirty).toEqual(false);
    expect(resultState.controls.inner5!.isPristine).toEqual(true);
  });

  it('should forward actions to children', () => {
    const state = setPropertiesRecursively(INITIAL_STATE, [['isDirty', true], ['isPristine', false]]);
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(state.controls.inner.id));
    expect(resultState).not.toBe(state);
  });
});
