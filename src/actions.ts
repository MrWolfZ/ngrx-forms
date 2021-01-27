import { createAction, union} from '@ngrx/store';
import { KeyValue, NgrxFormControlId, ValidationErrors } from './state';

// Enum for the ngrx/forms actions, internal use only
enum NGRX_FORMS_ACTION_TYPES {
  SetValueActionType = 'ngrx/forms/SET_VALUE',
  SetErrorsActionType = 'ngrx/forms/SET_ERRORS',
  SetAsyncErrorActionType = 'ngrx/forms/SET_ASYNC_ERROR',
  ClearAsyncErrorActionType = 'ngrx/forms/CLEAR_ASYNC_ERROR',
  StartAsyncValidationActionType = 'ngrx/forms/START_ASYNC_VALIDATION',
  MarkAsDirtyActionType = 'ngrx/forms/MARK_AS_DIRTY',
  MarkAsPristineActionType = 'ngrx/forms/MARK_AS_PRISTINE',
  EnableActionType = 'ngrx/forms/ENABLE',
  DisableActionType = 'ngrx/forms/DISABLE',
  MarkAsTouchedActionType = 'ngrx/forms/MARK_AS_TOUCHED',
  MarkAsUntouchedActionType = 'ngrx/forms/MARK_AS_UNTOUCHED',
  FocusActionType = 'ngrx/forms/FOCUS',
  UnfocusActionType = 'ngrx/forms/UNFOCUS',
  MarkAsSubmittedActionType = 'ngrx/forms/MARK_AS_SUBMITTED',
  MarkAsUnsubmittedActionType = 'ngrx/forms/MARK_AS_UNSUBMITTED',
  AddArrayControlActionType = 'ngrx/forms/ADD_ARRAY_CONTROL',
  AddGroupControlActionType = 'ngrx/forms/ADD_GROUP_CONTROL',
  RemoveArrayControlActionType = 'ngrx/forms/REMOVE_ARRAY_CONTROL',
  SwapArrayControlActionType = 'ngrx/forms/SWAP_ARRAY_CONTROL',
  MoveArrayControlActionType = 'ngrx/forms/MOVE_ARRAY_CONTROL',
  RemoveGroupControlActionType = 'ngrx/forms/REMOVE_CONTROL',
  SetUserDefinedPropertyActionType = 'ngrx/forms/SET_USER_DEFINED_PROPERTY',
  ResetActionType = 'ngrx/forms/RESET'
}

// using the creator fnc doesnt break api and we can use generic types
export const SetValueAction = createAction(NGRX_FORMS_ACTION_TYPES.SetValueActionType, (controlId: NgrxFormControlId, value: any) => ({ controlId: controlId, value: value }));
export const SetErrorsAction = createAction(NGRX_FORMS_ACTION_TYPES.SetErrorsActionType, (controlId: NgrxFormControlId, errors: ValidationErrors) => ({controlId, errors}));
//
export const SetAsyncErrorAction = createAction(NGRX_FORMS_ACTION_TYPES.SetAsyncErrorActionType,(controlId: NgrxFormControlId, name: string, value: any) => ({controlId, name, value}));
export const ClearAsyncErrorAction = createAction(NGRX_FORMS_ACTION_TYPES.ClearAsyncErrorActionType, (controlId: NgrxFormControlId, name: string) => ({controlId, name}));
export const StartAsyncValidationAction = createAction(NGRX_FORMS_ACTION_TYPES.StartAsyncValidationActionType, (controlId: NgrxFormControlId, name: string) => ({controlId, name}));
//
export const MarkAsDirtyAction = createAction(NGRX_FORMS_ACTION_TYPES.MarkAsDirtyActionType,(controlId: NgrxFormControlId) => ({controlId}));
export const MarkAsTouchedAction = createAction(NGRX_FORMS_ACTION_TYPES.MarkAsTouchedActionType,(controlId: NgrxFormControlId) => ({controlId}));
export const MarkAsUntouchedAction = createAction(NGRX_FORMS_ACTION_TYPES.MarkAsUntouchedActionType, (controlId: NgrxFormControlId) => ({controlId}));
export const MarkAsPristineAction = createAction(NGRX_FORMS_ACTION_TYPES.MarkAsPristineActionType,(controlId: NgrxFormControlId) => ({controlId}));
export const MarkAsSubmittedAction = createAction(NGRX_FORMS_ACTION_TYPES.MarkAsSubmittedActionType,(controlId: NgrxFormControlId) => ({controlId}));
export const MarkAsUnsubmittedAction = createAction(NGRX_FORMS_ACTION_TYPES.MarkAsUnsubmittedActionType, (controlId: NgrxFormControlId) => ({controlId}));
//
export const EnableAction = createAction(NGRX_FORMS_ACTION_TYPES.EnableActionType, (controlId: NgrxFormControlId) => ({controlId}));
export const DisableAction = createAction(NGRX_FORMS_ACTION_TYPES.DisableActionType, (controlId: NgrxFormControlId) => ({controlId}));
//
export const FocusAction = createAction(NGRX_FORMS_ACTION_TYPES.FocusActionType, (controlId: NgrxFormControlId) => ({controlId}));
export const UnfocusAction = createAction(NGRX_FORMS_ACTION_TYPES.UnfocusActionType, (controlId: NgrxFormControlId) => ({controlId}));
//
export const AddArrayControlAction = createAction(NGRX_FORMS_ACTION_TYPES.AddArrayControlActionType,
    <TValue>(controlId: NgrxFormControlId, value: TValue, index?: number) => ({controlId, value, index}));
export const AddGroupControlAction = createAction(NGRX_FORMS_ACTION_TYPES.AddGroupControlActionType,
    <TValue extends KeyValue, TControlKey extends keyof TValue = keyof TValue>(controlId: NgrxFormControlId, name: keyof TValue, value: TValue[TControlKey]) => ({controlId, name, value}));

export const RemoveArrayControlAction = createAction(NGRX_FORMS_ACTION_TYPES.RemoveArrayControlActionType,
    (controlId: NgrxFormControlId, index: number) => ({controlId, index}));

export const SwapArrayControlAction = createAction(NGRX_FORMS_ACTION_TYPES.SwapArrayControlActionType,
    (controlId: NgrxFormControlId, fromIndex: number, toIndex: number) => ({controlId, fromIndex, toIndex}));

export const MoveArrayControlAction = createAction(NGRX_FORMS_ACTION_TYPES.MoveArrayControlActionType,
    (controlId: NgrxFormControlId, fromIndex: number, toIndex: number) => ({controlId, fromIndex, toIndex}));

export const RemoveGroupControlAction = createAction(NGRX_FORMS_ACTION_TYPES.RemoveGroupControlActionType,
    <TValue extends string>(controlId: NgrxFormControlId, name: TValue) => ({controlId, name}));

export const SetUserDefinedPropertyAction = createAction(NGRX_FORMS_ACTION_TYPES.SetUserDefinedPropertyActionType,
    (controlId: NgrxFormControlId, name: string, value: any) => ({controlId, name, value}));

export const ResetAction = createAction(NGRX_FORMS_ACTION_TYPES.ResetActionType,
    (controlId: NgrxFormControlId) => ({controlId}));

export const NgrxFormActions = union({
  SetValueAction,
  SetErrorsAction,
  //
  SetAsyncErrorAction,
  ClearAsyncErrorAction,
  StartAsyncValidationAction,
  //
  MarkAsDirtyAction,
  MarkAsTouchedAction,
  MarkAsUntouchedAction,
  MarkAsPristineAction,
  MarkAsSubmittedAction,
  MarkAsUnsubmittedAction,
  //
  EnableAction,
  DisableAction,
  //
  FocusAction,
  UnfocusAction,
  //
  AddArrayControlAction,
  AddGroupControlAction,
  RemoveArrayControlAction,
  SwapArrayControlAction,
  MoveArrayControlAction,
  RemoveGroupControlAction,
  SetUserDefinedPropertyAction,
  ResetAction
});

export type NgrxFormActionTypes = typeof NgrxFormActions;

export function isNgrxFormsAction(action: NgrxFormActionTypes) {
  return !!action.type && action.type.startsWith('ngrx/forms/');
}

// needed for onNgrxForms
export const ALL_NGRX_FORMS_ACTION_TYPES: NgrxFormActionTypes['type'][] = [
  SetValueAction.type,
  SetErrorsAction.type,
  SetAsyncErrorAction.type,
  ClearAsyncErrorAction.type,
  StartAsyncValidationAction.type,
  MarkAsDirtyAction.type,
  MarkAsPristineAction.type,
  EnableAction.type,
  DisableAction.type,
  MarkAsTouchedAction.type,
  MarkAsUntouchedAction.type,
  FocusAction.type,
  UnfocusAction.type,
  MarkAsSubmittedAction.type,
  MarkAsUnsubmittedAction.type,
  AddGroupControlAction.type,
  RemoveGroupControlAction.type,
  AddArrayControlAction.type,
  RemoveArrayControlAction.type,
  SetUserDefinedPropertyAction.type,
  ResetAction.type,
  SwapArrayControlAction.type,
  MoveArrayControlAction.type,
];
