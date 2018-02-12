import { Action } from '@ngrx/store';
import { ValidationErrors } from '@angular/forms';
import { NgrxFormControlId, KeyValue } from './state';

export const ngrxFormsActionPrefix = 'ngrx/forms';

export class SetValueAction<TValue> implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/SET_VALUE`;
  readonly type = SetValueAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly value: TValue;
  };

  constructor(
    controlId: string,
    value: TValue,
  ) {
    this.controlId = controlId;
    this.payload = { value };
  }
}

export class SetErrorsAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/SET_ERRORS`;
  readonly type = SetErrorsAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly errors: ValidationErrors;
  };

  constructor(
    controlId: string,
    errors: ValidationErrors,
  ) {
    this.controlId = controlId;
    this.payload = {
      errors,
    };
  }
}

export class SetAsyncErrorAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/SET_ASYNC_ERROR`;
  readonly type = SetAsyncErrorAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly name: string;
    readonly value: any;
  };

  constructor(
    controlId: string,
    name: string,
    value: any,
  ) {
    this.controlId = controlId;
    this.payload = {
      name,
      value,
    };
  }
}

export class ClearAsyncErrorAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/CLEAR_ASYNC_ERROR`;
  readonly type = ClearAsyncErrorAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly name: string;
  };

  constructor(
    controlId: string,
    name: string,
  ) {
    this.controlId = controlId;
    this.payload = {
      name,
    };
  }
}

export class StartAsyncValidationAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/START_ASYNC_VALIDATION`;
  readonly type = StartAsyncValidationAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly name: string;
  };

  constructor(
    controlId: string,
    name: string,
  ) {
    this.controlId = controlId;
    this.payload = {
      name,
    };
  }
}

export class MarkAsDirtyAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/MARK_AS_DIRTY`;
  readonly type = MarkAsDirtyAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsPristineAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/MARK_AS_PRISTINE`;
  readonly type = MarkAsPristineAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class EnableAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/ENABLE`;
  readonly type = EnableAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class DisableAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/DISABLE`;
  readonly type = DisableAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsTouchedAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/MARK_AS_TOUCHED`;
  readonly type = MarkAsTouchedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsUntouchedAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/MARK_AS_UNTOUCHED`;
  readonly type = MarkAsUntouchedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class FocusAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/FOCUS`;
  readonly type = FocusAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class UnfocusAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/UNFOCUS`;
  readonly type = UnfocusAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsSubmittedAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/MARK_AS_SUBMITTED`;
  readonly type = MarkAsSubmittedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsUnsubmittedAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/MARK_AS_UNSUBMITTED`;
  readonly type = MarkAsUnsubmittedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class AddArrayControlAction<TValue> implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/ADD_ARRAY_CONTROL`;
  readonly type = AddArrayControlAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly value: TValue;
    readonly index: number | null;
  };

  constructor(
    controlId: string,
    value: TValue,
    index: number | null = null,
  ) {
    this.controlId = controlId;
    this.payload = { index, value };
  }
}

export class AddGroupControlAction<TValue extends KeyValue, TControlKey extends keyof TValue = string> implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/ADD_GROUP_CONTROL`;
  readonly type = AddGroupControlAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly name: keyof TValue;
    readonly value: TValue[TControlKey];
  };

  constructor(
    controlId: string,
    name: keyof TValue,
    value: TValue[TControlKey],
  ) {
    this.controlId = controlId;
    this.payload = { name, value };
  }
}

export class RemoveArrayControlAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/REMOVE_ARRAY_CONTROL`;
  readonly type = RemoveArrayControlAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly index: number;
  };

  constructor(
    controlId: string,
    index: number,
  ) {
    this.controlId = controlId;
    this.payload = { index };
  }
}

export class RemoveGroupControlAction<TValue> implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/REMOVE_CONTROL`;
  readonly type = RemoveGroupControlAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly name: keyof TValue;
  };

  constructor(
    controlId: string,
    name: keyof TValue,
  ) {
    this.controlId = controlId;
    this.payload = { name };
  }
}

export class SetUserDefinedPropertyAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/SET_USER_DEFINED_PROPERTY`;
  readonly type = SetUserDefinedPropertyAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    readonly name: string;
    readonly value: any;
  };

  constructor(
    controlId: string,
    name: string,
    value: any,
  ) {
    this.controlId = controlId;
    this.payload = { name, value };
  }
}

export class ResetAction implements Action {
  static readonly TYPE = `${ngrxFormsActionPrefix}/RESET`;
  readonly type = ResetAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
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
  ;

export function isNgrxFormsAction(action: Action) {
  return action.type && action.type.startsWith(`${ngrxFormsActionPrefix}/`);
}
