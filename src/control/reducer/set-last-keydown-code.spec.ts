import { FormControlState, createFormControlState } from '../../state';
import { SetLastKeyDownCodeAction } from '../../actions';
import { setLastKeydownCodeReducer } from './set-last-keydown-code';

describe('form control setLastKeydownCodeReducer', () => {
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = '';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  it('should skip any actionof the wrong type', () =>
    expect(setLastKeydownCodeReducer(INITIAL_STATE, { type: '' } as any)).toBe(INITIAL_STATE));

  it('should update state lastKeyDownCode if different', () => {
    const lastKeyDownCode = 12;
    const resultState = setLastKeydownCodeReducer(INITIAL_STATE, new SetLastKeyDownCodeAction(FORM_CONTROL_ID, lastKeyDownCode));
    expect(resultState.lastKeyDownCode).toEqual(lastKeyDownCode);
  });

  it('should not update state lastKeyDownCode if same', () => {
    const lastKeyDownCode = 12;
    const state = { ...INITIAL_STATE, lastKeyDownCode };
    const resultState = setLastKeydownCodeReducer(state, new SetLastKeyDownCodeAction(FORM_CONTROL_ID, lastKeyDownCode));
    expect(resultState).toBe(state);
  });
});
