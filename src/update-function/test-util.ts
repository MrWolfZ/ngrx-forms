import { createFormGroupState } from '../state';

export const FORM_CONTROL_ID = 'test ID';
export const FORM_CONTROL_INNER_ID = `${FORM_CONTROL_ID}.inner`;
export const FORM_CONTROL_INNER2_ID = `${FORM_CONTROL_ID}.inner2`;
export const FORM_CONTROL_INNER5_ID = `${FORM_CONTROL_ID}.inner5`;
export interface NestedValue { inner4: string; }
export interface FormGroupValue { inner: string; inner2?: string; inner3?: NestedValue; inner5: string[]; }
export const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '', inner3: { inner4: '' }, inner5: [''] };
export const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
