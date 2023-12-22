import {
  addArrayControl,
  addGroupControl,
  ALL_NGRX_FORMS_ACTION_TYPES,
  clearAsyncError,
  compose,
  createFormArrayState,
  createFormControlState,
  createFormGroupState,
  createFormStateReducerWithUpdate,
  disable,
  enable,
  focus,
  formArrayReducer,
  formControlReducer,
  formGroupReducer,
  formStateReducer,
  isArrayState,
  isGroupState,
  markAsDirty,
  markAsPristine,
  markAsSubmitted,
  markAsTouched,
  markAsUnsubmitted,
  markAsUntouched,
  moveArrayControl,
  NGRX_FORM_VIEW_ADAPTER,
  NGRX_STATUS_CLASS_NAMES,
  NGRX_UPDATE_ON_TYPE,
  NgrxCheckboxViewAdapter,
  NgrxDefaultViewAdapter,
  NgrxFallbackSelectOption,
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxFormsModule,
  NgrxLocalFormControlDirective,
  NgrxLocalFormDirective,
  NgrxNumberViewAdapter,
  NgrxRadioViewAdapter,
  NgrxRangeViewAdapter,
  NgrxSelectMultipleOption,
  NgrxSelectMultipleViewAdapter,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
  NgrxStatusCssClassesDirective,
  NgrxValueConverters,
  onNgrxForms,
  onNgrxFormsAction,
  removeArrayControl,
  removeGroupControl,
  reset,
  setAsyncError,
  setErrors,
  setUserDefinedProperty,
  setValue,
  startAsyncValidation,
  swapArrayControl,
  unfocus,
  updateArray,
  updateGroup,
  updateRecursive,
  validate,
  wrapReducerWithFormStateUpdate,
} from './ngrx-forms';

describe('ngrx-forms', () => {
  it(`should export ALL_NGRX_FORMS_ACTION_TYPES`, () => expect(ALL_NGRX_FORMS_ACTION_TYPES).toBeDefined());
  it(`should export NGRX_FORM_VIEW_ADAPTER`, () => expect(NGRX_FORM_VIEW_ADAPTER).toBeDefined());
  it(`should export NGRX_UPDATE_ON_TYPE`, () => expect(NGRX_UPDATE_ON_TYPE).toBeDefined());
  it(`should export ${compose.name}`, () => expect(compose).toBeDefined());
  it(`should export ${isArrayState.name}`, () => expect(isArrayState).toBeDefined());
  it(`should export ${isGroupState.name}`, () => expect(isGroupState).toBeDefined());
  it(`should export ${createFormControlState.name}`, () => expect(createFormControlState).toBeDefined());
  it(`should export ${createFormGroupState.name}`, () => expect(createFormGroupState).toBeDefined());
  it(`should export ${createFormArrayState.name}`, () => expect(createFormArrayState).toBeDefined());
  it(`should export ${formControlReducer.name}`, () => expect(formControlReducer).toBeDefined());
  it(`should export ${formGroupReducer.name}`, () => expect(formGroupReducer).toBeDefined());
  it(`should export ${formArrayReducer.name}`, () => expect(formArrayReducer).toBeDefined());
  it(`should export ${formStateReducer.name}`, () => expect(formStateReducer).toBeDefined());
  it(`should export ${onNgrxForms.name}`, () => expect(onNgrxForms).toBeDefined());
  it(`should export ${onNgrxFormsAction.name}`, () => expect(onNgrxFormsAction).toBeDefined());
  it(`should export ${createFormStateReducerWithUpdate.name}`, () => expect(createFormStateReducerWithUpdate).toBeDefined());
  it(`should export ${wrapReducerWithFormStateUpdate.name}`, () => expect(wrapReducerWithFormStateUpdate).toBeDefined());
  it(`should export ${addArrayControl.name}`, () => expect(addArrayControl).toBeDefined());
  it(`should export ${addGroupControl.name}`, () => expect(addGroupControl).toBeDefined());
  it(`should export ${clearAsyncError.name}`, () => expect(clearAsyncError).toBeDefined());
  it(`should export ${disable.name}`, () => expect(disable).toBeDefined());
  it(`should export ${enable.name}`, () => expect(enable).toBeDefined());
  it(`should export ${focus.name}`, () => expect(focus).toBeDefined());
  it(`should export ${markAsDirty.name}`, () => expect(markAsDirty).toBeDefined());
  it(`should export ${markAsPristine.name}`, () => expect(markAsPristine).toBeDefined());
  it(`should export ${markAsSubmitted.name}`, () => expect(markAsSubmitted).toBeDefined());
  it(`should export ${markAsTouched.name}`, () => expect(markAsTouched).toBeDefined());
  it(`should export ${markAsUnsubmitted.name}`, () => expect(markAsUnsubmitted).toBeDefined());
  it(`should export ${markAsUntouched.name}`, () => expect(markAsUntouched).toBeDefined());
  it(`should export ${moveArrayControl.name}`, () => expect(moveArrayControl).toBeDefined());
  it(`should export ${removeArrayControl.name}`, () => expect(removeArrayControl).toBeDefined());
  it(`should export ${removeGroupControl.name}`, () => expect(removeGroupControl).toBeDefined());
  it(`should export ${reset.name}`, () => expect(reset).toBeDefined());
  it(`should export ${setAsyncError.name}`, () => expect(setAsyncError).toBeDefined());
  it(`should export ${setErrors.name}`, () => expect(setErrors).toBeDefined());
  it(`should export ${setUserDefinedProperty.name}`, () => expect(setUserDefinedProperty).toBeDefined());
  it(`should export ${setValue.name}`, () => expect(setValue).toBeDefined());
  it(`should export ${startAsyncValidation.name}`, () => expect(startAsyncValidation).toBeDefined());
  it(`should export ${swapArrayControl.name}`, () => expect(swapArrayControl).toBeDefined());
  it(`should export ${unfocus.name}`, () => expect(unfocus).toBeDefined());
  it(`should export ${updateArray.name}`, () => expect(updateArray).toBeDefined());
  it(`should export ${updateGroup.name}`, () => expect(updateGroup).toBeDefined());
  it(`should export ${updateRecursive.name}`, () => expect(updateRecursive).toBeDefined());
  it(`should export ${validate.name}`, () => expect(validate).toBeDefined());
  it(`should export NGRX_STATUS_CLASS_NAMES`, () => expect(NGRX_STATUS_CLASS_NAMES).toBeDefined());
  it(`should export ${NgrxFormControlDirective.name}`, () => expect(NgrxFormControlDirective).toBeDefined());
  it(`should export ${NgrxLocalFormControlDirective.name}`, () => expect(NgrxLocalFormControlDirective).toBeDefined());
  it(`should export NgrxValueConverters`, () => expect(NgrxValueConverters).toBeDefined());
  it(`should export ${NgrxFormDirective.name}`, () => expect(NgrxFormDirective).toBeDefined());
  it(`should export ${NgrxLocalFormDirective.name}`, () => expect(NgrxLocalFormDirective).toBeDefined());
  it(`should export ${NgrxDefaultViewAdapter.name}`, () => expect(NgrxDefaultViewAdapter).toBeDefined());
  it(`should export ${NgrxCheckboxViewAdapter.name}`, () => expect(NgrxCheckboxViewAdapter).toBeDefined());
  it(`should export ${NgrxNumberViewAdapter.name}`, () => expect(NgrxNumberViewAdapter).toBeDefined());
  it(`should export ${NgrxRangeViewAdapter.name}`, () => expect(NgrxRangeViewAdapter).toBeDefined());
  it(`should export ${NgrxSelectViewAdapter.name}`, () => expect(NgrxSelectViewAdapter).toBeDefined());
  it(`should export ${NgrxSelectMultipleViewAdapter.name}`, () => expect(NgrxSelectMultipleViewAdapter).toBeDefined());
  it(`should export ${NgrxRadioViewAdapter.name}`, () => expect(NgrxRadioViewAdapter).toBeDefined());
  it(`should export ${NgrxSelectOption.name}`, () => expect(NgrxSelectOption).toBeDefined());
  it(`should export ${NgrxSelectMultipleOption.name}`, () => expect(NgrxSelectMultipleOption).toBeDefined());
  it(`should export ${NgrxFallbackSelectOption.name}`, () => expect(NgrxFallbackSelectOption).toBeDefined());
  it(`should export ${NgrxStatusCssClassesDirective.name}`, () => expect(NgrxStatusCssClassesDirective).toBeDefined());
  it(`should export ${NgrxFormsModule.name}`, () => expect(NgrxFormsModule).toBeDefined());
});
