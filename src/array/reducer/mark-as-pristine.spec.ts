import { MarkAsPristineAction } from '../../actions';
import { cast, createFormArrayState } from '../../state';
import { markAsPristineReducer } from './mark-as-pristine';

describe('form group markAsPristineReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const FORM_CONTROL_0_ID = FORM_CONTROL_ID + '.0';
  const FORM_CONTROL_1_ID = FORM_CONTROL_ID + '.1';
  const INITIAL_FORM_ARRAY_VALUE = ['', ''];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: '' }, { inner2: '' }];
  const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [[''], ['']];
  const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
  const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
  const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);

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

  it('should mark direct control children as pristine', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: [
        INITIAL_STATE.controls[0],
        {
          ...INITIAL_STATE.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });

  it('should mark direct group children as pristine', () => {
    const state = {
      ...INITIAL_STATE_NESTED_GROUP,
      isDirty: true,
      isPristine: false,
      controls: [
        INITIAL_STATE_NESTED_GROUP.controls[0],
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });

  it('should mark direct array children as pristine', () => {
    const state = {
      ...INITIAL_STATE_NESTED_ARRAY,
      isDirty: true,
      isPristine: false,
      controls: [
        INITIAL_STATE_NESTED_ARRAY.controls[0],
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });

  it('should mark state as pristine if all children are pristine when direct control child is updated', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: [
        INITIAL_STATE.controls[0],
        {
          ...INITIAL_STATE.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_1_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not mark state as pristine if not all children are pristine when direct control child is updated', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isDirty: true,
          isPristine: false,
        },
        {
          ...INITIAL_STATE.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as pristine if all children are pristine when direct group child is updated', () => {
    const state = {
      ...INITIAL_STATE_NESTED_GROUP,
      isDirty: true,
      isPristine: false,
      controls: [
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[0],
          isDirty: true,
          isPristine: false,
        },
        {
          ...INITIAL_STATE_NESTED_GROUP.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as pristine if all children are pristine when direct array child is updated', () => {
    const state = {
      ...INITIAL_STATE_NESTED_ARRAY,
      isDirty: true,
      isPristine: false,
      controls: [
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[0],
          isDirty: true,
          isPristine: false,
        },
        {
          ...INITIAL_STATE_NESTED_ARRAY.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_0_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should forward actions to children', () => {
    const state = {
      ...INITIAL_STATE,
      isDirty: true,
      isPristine: false,
      controls: [
        {
          ...INITIAL_STATE.controls[0],
          isDirty: true,
          isPristine: false,
        },
        {
          ...INITIAL_STATE.controls[1],
          isDirty: true,
          isPristine: false,
        },
      ],
    };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_0_ID));
    expect(resultState.controls[0].isDirty).toEqual(false);
    expect(resultState.controls[0].isPristine).toEqual(true);
  });
});
