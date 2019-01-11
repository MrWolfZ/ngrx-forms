import { CreateGroupElementAction, formStateReducer, INITIAL_STATE, RemoveGroupElementAction } from './dynamic.reducer';

describe('dynamic', () => {
  describe('group', () => {
    it('should add group controls', () => {
      const controlName = 'newControl';
      const state = formStateReducer(INITIAL_STATE, new CreateGroupElementAction(controlName));
      expect(state.controls.group.controls[controlName]).toBeDefined();
    });

    it('should add group controls with initial value false', () => {
      const controlName = 'newControl';
      const state = formStateReducer(INITIAL_STATE, new CreateGroupElementAction(controlName));
      expect(state.controls.group.controls[controlName].value).toBe(false);
    });

    it('should remove group controls', () => {
      const controlName = 'newControl';
      let state = formStateReducer(INITIAL_STATE, new CreateGroupElementAction(controlName));
      state = formStateReducer(state, new RemoveGroupElementAction(controlName));
      expect(state.controls.group.controls[controlName]).toBeUndefined();
    });
  });
});
