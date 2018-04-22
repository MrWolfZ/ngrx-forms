import { INITIAL_STATE, validateAndUpdateForm } from './sync-validation.reducer';

describe('sync validation', () => {
  describe(validateAndUpdateForm.name, () => {
    it('should validate the user name is required', () => {
      const state = validateAndUpdateForm(INITIAL_STATE);
      expect(state.controls.userName.errors.required).toBeDefined();
    });
  });
});
