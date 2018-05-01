import { RemoveArrayControlAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { removeControlReducer } from './remove-control';
import { FORM_CONTROL_ID } from './test-util';

describe(`form group ${removeControlReducer.name}`, () => {
  const INITIAL_FORM_ARRAY_VALUE = ['A', 'B'];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: 'A' }, { inner: 'B' }];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [['A'], ['B']];
  const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
  const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
  const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);

  it('should remove child state', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 0);
    const resultState = removeControlReducer(INITIAL_STATE, action);
    expect(resultState.value).toEqual([INITIAL_FORM_ARRAY_VALUE[1]]);
    expect(resultState.controls[1]).toBeUndefined();
    expect(resultState.controls[0].id).toEqual(`${FORM_CONTROL_ID}.0`);
  });

  it('should remove child state for group children', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 0);
    const resultState = removeControlReducer(INITIAL_STATE_NESTED_GROUP, action);
    expect(resultState.value).toEqual([INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP[1]]);
    expect(resultState.controls[1]).toBeUndefined();
    expect(resultState.controls[0].id).toEqual(`${FORM_CONTROL_ID}.0`);
  });

  it('should remove child state for array children', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 0);
    const resultState = removeControlReducer(INITIAL_STATE_NESTED_ARRAY, action);
    expect(resultState.value).toEqual([INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY[1]]);
    expect(resultState.controls[1]).toBeUndefined();
    expect(resultState.controls[0].id).toEqual(`${FORM_CONTROL_ID}.0`);
  });

  it('should update nested child IDs for group children', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 0);
    const resultState = removeControlReducer(INITIAL_STATE_NESTED_GROUP, action);
    expect(resultState.controls[0].controls.inner.id).toEqual(`${FORM_CONTROL_ID}.0.inner`);
  });

  it('should update nested child IDs for array children', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 0);
    const resultState = removeControlReducer(INITIAL_STATE_NESTED_ARRAY, action);
    expect(resultState.controls[0].controls[0].id).toEqual(`${FORM_CONTROL_ID}.0.0`);
  });

  it('should remove last element', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 1);
    const resultState = removeControlReducer(INITIAL_STATE, action);
    expect(resultState.value).toEqual([INITIAL_FORM_ARRAY_VALUE[0]]);
    expect(resultState.controls[1]).toBeUndefined();
    expect(resultState.controls[0].id).toEqual(`${FORM_CONTROL_ID}.0`);
  });

  it('should remove child errors for removed child', () => {
    const id = 'ID';
    const errors = { required: true };
    let state = createFormArrayState(id, [5]);
    state = {
      ...state,
      errors: {
        _0: errors,
      },
      controls: [
        {
          ...state.controls[0],
          errors,
        },
      ],
    };
    const action = new RemoveArrayControlAction(id, 0);
    const resultState = removeControlReducer<number>(state, action);
    expect(resultState.value).toEqual([]);
    expect(resultState.errors).toEqual({});
    expect(resultState.controls[0]).toBeUndefined();
  });

  it('should remove child errors for removed child and keep own errors', () => {
    const id = 'ID';
    const errors = { required: true };
    let state = createFormArrayState<number>(id, [5]);
    state = {
      ...state,
      errors: {
        _0: errors,
        ...errors,
      },
      controls: [
        {
          ...state.controls[0],
          errors,
        },
      ],
    };
    const action = new RemoveArrayControlAction(id, 0);
    const resultState = removeControlReducer(state, action);
    expect(resultState.value).toEqual([]);
    expect(resultState.errors).toEqual(errors);
    expect(resultState.controls[0]).toBeUndefined();
  });

  it('should throw if trying to remove non-existing control', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, 2);
    expect(() => removeControlReducer(INITIAL_STATE, action)).toThrowError();
  });

  it('should throw if trying to remove control at negative index', () => {
    const action = new RemoveArrayControlAction(FORM_CONTROL_ID, -1);
    expect(() => removeControlReducer(INITIAL_STATE, action)).toThrowError();
  });

  it('should foward actions to children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [['']]);
    const action = new RemoveArrayControlAction(state.controls[0].id, 0);
    const resultState = removeControlReducer(state, action);
    expect(resultState.controls[0].value).toEqual([]);
  });
});
