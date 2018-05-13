import {SwapArrayControlAction} from '../../actions';
import {cast} from '../../state';
import {
  FORM_CONTROL_ID,
  INITIAL_FORM_ARRAY_STATE_DEEPLY_NESTED_GROUPS,
  INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS,
  INITIAL_STATE_NESTED_GROUP
} from './test-util';
import {swapControlReducer} from './swap-control';

describe(`form array swap`, () => {
  it('should swap controls forwards', () => {
    const action = new SwapArrayControlAction(FORM_CONTROL_ID, 0, 2);
    const expectedValue = [...INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS];
    expectedValue[0] = INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS[2];
    expectedValue[2] = INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS[0];
    const resultState = swapControlReducer(INITIAL_FORM_ARRAY_STATE_DEEPLY_NESTED_GROUPS, action);
    expect(expectedValue).toEqual(resultState.value);
  });

  it('should swap controls backwards', () => {
    const action = new SwapArrayControlAction(FORM_CONTROL_ID, 2, 0);
    const expectedValue = [...INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS];
    expectedValue[2] = INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS[0];
    expectedValue[0] = INITIAL_FORM_ARRAY_VALUE_DEEPLY_NESTED_GROUPS[2];
    const resultState = swapControlReducer(INITIAL_FORM_ARRAY_STATE_DEEPLY_NESTED_GROUPS, action);
    expect(expectedValue).toEqual(resultState.value);
  });

  it('should throw on invalid indices', () => {
    expect(() => new SwapArrayControlAction(FORM_CONTROL_ID, -1, 0)).toThrow();
    expect(() => new SwapArrayControlAction(FORM_CONTROL_ID, 0, -1)).toThrow();
    expect(() => swapControlReducer(
      INITIAL_STATE_NESTED_GROUP,
      new SwapArrayControlAction(FORM_CONTROL_ID, 0, INITIAL_STATE_NESTED_GROUP.controls.length + 1))
    ).toThrow();
  });

  it('should update deeply nested child IDs after a swap', () => {
    const action = new SwapArrayControlAction(FORM_CONTROL_ID, 0, 2);
    const resultState = swapControlReducer(INITIAL_FORM_ARRAY_STATE_DEEPLY_NESTED_GROUPS, action);
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
