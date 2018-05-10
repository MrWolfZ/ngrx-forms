import { AddArrayControlAction } from '../../actions';
import { createFormArrayState } from '../../state';
import { addControlReducer } from './add-control';
import {
  DeeplyNestedGroupFormValue,
  FORM_CONTROL_ID,
  INITIAL_DEEPLY_NESTED_GROUPS_FORM_STATE,
  INITIAL_STATE,
  INITIAL_STATE_NESTED_ARRAY,
  INITIAL_STATE_NESTED_GROUP,
} from './test-util';

describe(`form array ${addControlReducer.name}`, () => {
  it('should create child state for control child', () => {
    const value = 'B';
    const action = new AddArrayControlAction(FORM_CONTROL_ID, value);
    const resultState = addControlReducer(INITIAL_STATE, action);
    expect(resultState.value).toEqual([...INITIAL_STATE.value, value]);
    expect(resultState.controls[2].value).toEqual(value);
  });

  it('should create child state for group child', () => {
    const value = { inner: 'D' };
    const action = new AddArrayControlAction(FORM_CONTROL_ID, value);
    const resultState = addControlReducer(INITIAL_STATE_NESTED_GROUP, action);
    expect(resultState.value).toEqual([...INITIAL_STATE_NESTED_GROUP.value, value]);
    expect(resultState.controls[2].value).toBe(value);
    expect(resultState.controls[2].controls).toBeDefined();
    expect(Array.isArray(resultState.controls[2].controls)).toBe(false);
  });

  it('should create child state for array child', () => {
    const value = ['A'];
    const action = new AddArrayControlAction(FORM_CONTROL_ID, value);
    const resultState = addControlReducer(INITIAL_STATE_NESTED_ARRAY, action);
    expect(resultState.value).toEqual([...INITIAL_STATE_NESTED_ARRAY.value, value]);
    expect(resultState.controls[2].value).toEqual(value);
    expect(resultState.controls[2].controls).toBeDefined();
    expect(Array.isArray(resultState.controls[2].controls)).toBe(true);
  });

  it('should create child state at the given index', () => {
    const value = 'B';
    const action = new AddArrayControlAction(FORM_CONTROL_ID, value, 1);
    const resultState = addControlReducer(INITIAL_STATE, action);
    expect(resultState.value).toEqual(['', value, '']);
    expect(resultState.controls[1].value).toEqual(value);
    expect(resultState.controls[1].id).toEqual(`${FORM_CONTROL_ID}.1`);
    expect(resultState.controls[2].value).toEqual('');
    expect(resultState.controls[2].id).toEqual(`${FORM_CONTROL_ID}.2`);
  });

  it('should create child state at the start', () => {
    const value = 'B';
    const action = new AddArrayControlAction(FORM_CONTROL_ID, value, 0);
    const resultState = addControlReducer(INITIAL_STATE, action);
    expect(resultState.value).toEqual([value, '', '']);
    expect(resultState.controls[0].value).toEqual(value);
    expect(resultState.controls[0].id).toEqual(`${FORM_CONTROL_ID}.0`);
    expect(resultState.controls[2].value).toEqual('');
    expect(resultState.controls[2].id).toEqual(`${FORM_CONTROL_ID}.2`);
  });

  it('should throw if trying to add control at out of bounds index', () => {
    const action = new AddArrayControlAction(FORM_CONTROL_ID, '', 3);
    expect(() => addControlReducer(INITIAL_STATE, action)).toThrowError();
  });

  it('should throw if trying to add control at negative index', () => {
    const action = new AddArrayControlAction(FORM_CONTROL_ID, '', -1);
    expect(() => addControlReducer(INITIAL_STATE, action)).toThrowError();
  });

  it('should foward actions to children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [['']]);
    const value = 'B';
    const action = new AddArrayControlAction(state.controls[0].id, value);
    const resultState = addControlReducer(state, action);
    expect(resultState.controls[0].value).toEqual([...state.controls[0].value, value]);
    expect(resultState.controls[0].controls[1].value).toEqual(value);
  });

  it('should update deeply nested child IDs after an insertion', () => {
    const value: DeeplyNestedGroupFormValue = {
      i: 'NEW_CONTROL',
      deep: {
        inners: [
          { inner: 'NEW_INNER_0' },
          { inner: 'NEW_INNER_1' },
          { inner: 'NEW_INNER_2' },
        ],
      },
    };

    const action = new AddArrayControlAction<DeeplyNestedGroupFormValue>(FORM_CONTROL_ID, value, 0);
    const resultState = addControlReducer<DeeplyNestedGroupFormValue>(INITIAL_DEEPLY_NESTED_GROUPS_FORM_STATE, action);

    expect(resultState.controls[0].value).toEqual(value);
    resultState.controls.forEach((control, index) => {
      expect(control.id).toEqual(`${FORM_CONTROL_ID}.${index}`);
      expect(control.controls.i.id).toEqual(`${FORM_CONTROL_ID}.${index}.i`);
      expect(control.controls.deep.id).toEqual(`${FORM_CONTROL_ID}.${index}.deep`);
      expect(control.controls.deep.controls.inners.id).toEqual(`${FORM_CONTROL_ID}.${index}.deep.inners`);
      control.controls.deep.controls.inners.controls.forEach((deepControl, deepIndex) => {
        expect(deepControl.id).toEqual(`${FORM_CONTROL_ID}.${index}.deep.inners.${deepIndex}`);
        expect(deepControl.controls.inner.id).toEqual(`${FORM_CONTROL_ID}.${index}.deep.inners.${deepIndex}.inner`);
      });
    });
  });
});
