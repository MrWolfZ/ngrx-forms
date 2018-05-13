import { Action } from '@ngrx/store';
import { KeyValue, NgrxFormControlId, ValidationErrors } from './state';

export class SetValueAction<TValue> implements Action {
  static readonly TYPE = 'ngrx/forms/SET_VALUE';
  readonly type = SetValueAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly value: TValue,
  ) { }
}

export class SetErrorsAction implements Action {
  static readonly TYPE = 'ngrx/forms/SET_ERRORS';
  readonly type = SetErrorsAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly errors: ValidationErrors,
  ) { }
}

export class SetAsyncErrorAction implements Action {
  static readonly TYPE = 'ngrx/forms/SET_ASYNC_ERROR';
  readonly type = SetAsyncErrorAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly name: string,
    public readonly value: any,
  ) { }
}

export class ClearAsyncErrorAction implements Action {
  static readonly TYPE = 'ngrx/forms/CLEAR_ASYNC_ERROR';
  readonly type = ClearAsyncErrorAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly name: string,
  ) { }
}

export class StartAsyncValidationAction implements Action {
  static readonly TYPE = 'ngrx/forms/START_ASYNC_VALIDATION';
  readonly type = StartAsyncValidationAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly name: string,
  ) { }
}

export class MarkAsDirtyAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_DIRTY';
  readonly type = MarkAsDirtyAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class MarkAsPristineAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_PRISTINE';
  readonly type = MarkAsPristineAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class EnableAction implements Action {
  static readonly TYPE = 'ngrx/forms/ENABLE';
  readonly type = EnableAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class DisableAction implements Action {
  static readonly TYPE = 'ngrx/forms/DISABLE';
  readonly type = DisableAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class MarkAsTouchedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_TOUCHED';
  readonly type = MarkAsTouchedAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class MarkAsUntouchedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_UNTOUCHED';
  readonly type = MarkAsUntouchedAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class FocusAction implements Action {
  static readonly TYPE = 'ngrx/forms/FOCUS';
  readonly type = FocusAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class UnfocusAction implements Action {
  static readonly TYPE = 'ngrx/forms/UNFOCUS';
  readonly type = UnfocusAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class MarkAsSubmittedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_SUBMITTED';
  readonly type = MarkAsSubmittedAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class MarkAsUnsubmittedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_UNSUBMITTED';
  readonly type = MarkAsUnsubmittedAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export class AddArrayControlAction<TValue> implements Action {
  static readonly TYPE = 'ngrx/forms/ADD_ARRAY_CONTROL';
  readonly type = AddArrayControlAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly value: TValue,
    public readonly index?: number,
  ) { }
}

export class AddGroupControlAction<TValue extends KeyValue, TControlKey extends keyof TValue = keyof TValue> implements Action {
  static readonly TYPE = 'ngrx/forms/ADD_GROUP_CONTROL';
  readonly type = AddGroupControlAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly name: keyof TValue,
    public readonly value: TValue[TControlKey],
  ) { }
}

export class RemoveArrayControlAction implements Action {
  static readonly TYPE = 'ngrx/forms/REMOVE_ARRAY_CONTROL';
  readonly type = RemoveArrayControlAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly index: number,
  ) { }
}

export class SwapArrayControlAction implements Action {
  static readonly TYPE = 'ngrx/forms/SWAP_ARRAY_CONTROL';
  readonly type = SwapArrayControlAction.TYPE;

  constructor(
      public readonly controlId: NgrxFormControlId,
      public readonly from: number,
      public readonly to: number
  ) {
    if (from < 0 || to < 0) {
      throw new Error('Swap indices cannot be negative.');
    }
  }
}

export class MoveArrayControlAction implements Action {
  static readonly TYPE = 'ngrx/forms/MOVE_ARRAY_CONTROL';
  readonly type = MoveArrayControlAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly from: number,
    public readonly to: number
  ) {
    if (from < 0 || to < 0) {
      throw new Error('Move indices cannot be negative.');
    }
  }
}

export class RemoveGroupControlAction<TValue> implements Action {
  static readonly TYPE = 'ngrx/forms/REMOVE_CONTROL';
  readonly type = RemoveGroupControlAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly name: keyof TValue,
  ) { }
}

export class SetUserDefinedPropertyAction implements Action {
  static readonly TYPE = 'ngrx/forms/SET_USER_DEFINED_PROPERTY';
  readonly type = SetUserDefinedPropertyAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
    public readonly name: string,
    public readonly value: any,
  ) { }
}

export class ResetAction implements Action {
  static readonly TYPE = 'ngrx/forms/RESET';
  readonly type = ResetAction.TYPE;

  constructor(
    public readonly controlId: NgrxFormControlId,
  ) { }
}

export type Actions<TValue> =
  | SetValueAction<TValue>
  | SetErrorsAction
  | SetAsyncErrorAction
  | ClearAsyncErrorAction
  | StartAsyncValidationAction
  | MarkAsDirtyAction
  | MarkAsPristineAction
  | EnableAction
  | DisableAction
  | MarkAsTouchedAction
  | MarkAsUntouchedAction
  | FocusAction
  | UnfocusAction
  | MarkAsSubmittedAction
  | MarkAsUnsubmittedAction
  | AddGroupControlAction<TValue>
  | RemoveGroupControlAction<TValue>
  | AddArrayControlAction<any>
  | RemoveArrayControlAction
  | SetUserDefinedPropertyAction
  | ResetAction
  | SwapArrayControlAction
  | MoveArrayControlAction
  ;

export function isNgrxFormsAction(action: Action) {
  return !!action.type && action.type.startsWith('ngrx/forms/');
}
