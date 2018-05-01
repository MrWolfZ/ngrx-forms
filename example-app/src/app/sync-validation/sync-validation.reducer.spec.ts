import { setValue, updateGroup } from 'ngrx-forms';

import { FormValue, INITIAL_STATE, validateAndUpdateForm } from './sync-validation.reducer';

describe('sync validation', () => {
  describe(validateAndUpdateForm.name, () => {
    it('should validate the user name is required', () => {
      const state = validateAndUpdateForm(INITIAL_STATE);
      expect(state.controls.userName.errors.required).toBeDefined();
    });

    it('should validate that agreeing to terms of use is required', () => {
      const state = validateAndUpdateForm(INITIAL_STATE);
      expect(state.controls.agreeToTermsOfUse.errors.required).toBeDefined();
    });

    it('should validate that the password is required', () => {
      const state = validateAndUpdateForm(INITIAL_STATE);
      expect(state.controls.password.controls.password.errors.required).toBeDefined();
    });

    describe('password', () => {
      const setPasswordValue = (v: string) => updateGroup<FormValue>({ password: updateGroup<FormValue['password']>({ password: setValue(v) }) });
      const setConfirmPasswordValue = (v: string) => updateGroup<FormValue>({ password: updateGroup<FormValue['password']>({ confirmPassword: setValue(v) }) });
      const setCreateAccountValue = (v: boolean) => updateGroup<FormValue>({ createAccount: setValue(v) });

      it('should validate that the password must be at least 8 characters long', () => {
        let state = setPasswordValue('abc')(INITIAL_STATE);
        state = validateAndUpdateForm(state);
        expect(state.controls.password.controls.password.errors.minLength).toBeDefined();
        state = validateAndUpdateForm(setPasswordValue('abcefghi')(state));
        expect(state.controls.password.controls.password.errors.minLength).toBeUndefined();
      });

      it('should validate that confirmPassword must match password', () => {
        const passwordValue = 'abcefghi';
        let state = setPasswordValue(passwordValue)(INITIAL_STATE);
        state = validateAndUpdateForm(state);
        expect(state.controls.password.errors.passwordMatch).toBeDefined();
        expect(state.controls.password.errors.passwordMatch).toEqual({ password: passwordValue, confirmPassword: '' });
        const invalidConfirmPasswordValue = 'abcefghj';
        state = validateAndUpdateForm(setConfirmPasswordValue(invalidConfirmPasswordValue)(state));
        expect(state.controls.password.errors.passwordMatch).toBeDefined();
        expect(state.controls.password.errors.passwordMatch).toEqual({ password: passwordValue, confirmPassword: invalidConfirmPasswordValue });
        state = validateAndUpdateForm(setConfirmPasswordValue(passwordValue)(state));
        expect(state.controls.password.errors.passwordMatch).toBeUndefined();
      });

      it('should disable the password controls when createAccount is not checked', () => {
        let state = setCreateAccountValue(false)(INITIAL_STATE);
        state = validateAndUpdateForm(state);
        expect(state.controls.password.isDisabled).toBe(true);
      });

      it('should enable the password controls when createAccount is checked', () => {
        let state = validateAndUpdateForm(setCreateAccountValue(false)(INITIAL_STATE));
        state = validateAndUpdateForm(setCreateAccountValue(true)(INITIAL_STATE));
        expect(state.controls.password.isEnabled).toBe(true);
      });
    });
  });
});
