import {MoveArrayControlAction} from '../../actions';
import {cast, createFormArrayState} from '../../state';
import {FORM_CONTROL_ID, INITIAL_FORM_ARRAY_STATE_DEEPLY_NESTED_GROUPS, INITIAL_STATE_NESTED_GROUP} from './test-util';
import {moveControlReducer} from './move-control';

describe(`form array move`, () => {
  const testArrayValue = [0, 1, 2, 3, 4, 5];
  const testArrayState = createFormArrayState(FORM_CONTROL_ID, testArrayValue);
  it('should move controls forward', () => {
    let action = new MoveArrayControlAction(FORM_CONTROL_ID, 2, 5);
    let resultState = moveControlReducer(testArrayState, action);
    expect(resultState).not.toBe(testArrayState);
    expect(resultState.controls).not.toBe(testArrayState.controls);
    expect(resultState.value).toEqual([0, 1, 3, 4, 5, 2]);

    action = new MoveArrayControlAction(FORM_CONTROL_ID, 0, 3);
    resultState = moveControlReducer(testArrayState, action);
    expect(resultState.value).toEqual([1, 2, 3, 0, 4, 5]);
  });

  it('should move controls backwards', () => {
    let action = new MoveArrayControlAction(FORM_CONTROL_ID, 5, 2);
    let resultState = moveControlReducer(testArrayState, action);
    expect(resultState).not.toBe(testArrayState);
    expect(resultState.controls).not.toBe(testArrayState.controls);
    expect(resultState.value).toEqual([0, 1, 5, 2, 3, 4]);

    action = new MoveArrayControlAction(FORM_CONTROL_ID, 3, 0);
    resultState = moveControlReducer(testArrayState, action);
    expect(resultState.value).toEqual([3, 0, 1, 2, 4, 5]);
  });

  it('should throw on invalid indices', () => {
    expect(() => new MoveArrayControlAction(FORM_CONTROL_ID, -1, 0)).toThrow();
    expect(() =>
      moveControlReducer(
        INITIAL_STATE_NESTED_GROUP,
        new MoveArrayControlAction(FORM_CONTROL_ID, -1, INITIAL_STATE_NESTED_GROUP.controls.length + 1))
    ).toThrow();
  });

  it('should update deeply nested child IDs after a move', () => {
    const action = new MoveArrayControlAction(FORM_CONTROL_ID, 0, 2);
    const resultState = moveControlReducer(INITIAL_FORM_ARRAY_STATE_DEEPLY_NESTED_GROUPS, action);
    resultState.controls.forEach((control, index) => {
      expect(control.id).toEqual(FORM_CONTROL_ID + `.${index}`);
      expect(cast(control).controls.i.id).toEqual(FORM_CONTROL_ID + `.${index}.i`);
      expect(cast(control).controls.deep.id).toEqual(FORM_CONTROL_ID + `.${index}.deep`);
      expect(cast(cast(control).controls.deep).controls.inners.id).toEqual(FORM_CONTROL_ID + `.${index}.deep.inners`);
      cast(cast(cast(control).controls.deep).controls.inners).controls.forEach((deepControl, deepIndex) => {
        expect(deepControl.id).toEqual(FORM_CONTROL_ID + `.${index}.deep.inners.${deepIndex}`);
        expect(cast<{ inner: string }>(deepControl).controls.inner.id).toEqual(FORM_CONTROL_ID + `.${index}.deep.inners.${deepIndex}.inner`);
      });
    });
  });
});
