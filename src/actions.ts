import { Action } from '@ngrx/store';
import { ValidationErrors } from '@angular/forms';
import { NgrxFormControlId } from './state';

export class SetValueAction<TValue> implements Action {
  static readonly TYPE = 'ngrx/forms/SET_VALUE';
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
  static readonly TYPE = 'ngrx/forms/SET_ERRORS';
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

export class MarkAsDirtyAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_DIRTY';
  readonly type = MarkAsDirtyAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsPristineAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_PRISTINE';
  readonly type = MarkAsPristineAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class EnableAction implements Action {
  static readonly TYPE = 'ngrx/forms/ENABLE';
  readonly type = EnableAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class DisableAction implements Action {
  static readonly TYPE = 'ngrx/forms/DISABLE';
  readonly type = DisableAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsTouchedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_TOUCHED';
  readonly type = MarkAsTouchedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsUntouchedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_UNTOUCHED';
  readonly type = MarkAsUntouchedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class FocusAction implements Action {
  static readonly TYPE = 'ngrx/forms/FOCUS';
  readonly type = FocusAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class UnfocusAction implements Action {
  static readonly TYPE = 'ngrx/forms/UNFOCUS';
  readonly type = UnfocusAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class SetLastKeyDownCodeAction implements Action {
  static readonly TYPE = 'ngrx/forms/SET_LAST_KEY_DOWN_CODE';
  readonly type = SetLastKeyDownCodeAction.TYPE;
  readonly controlId: NgrxFormControlId;

  readonly payload: {
    lastKeyDownCode: number;
  };

  constructor(controlId: string, lastKeyDownCode: number) {
    this.controlId = controlId;
    this.payload = { lastKeyDownCode };
  }
}

export class MarkAsSubmittedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_SUBMITTED';
  readonly type = MarkAsSubmittedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class MarkAsUnsubmittedAction implements Action {
  static readonly TYPE = 'ngrx/forms/MARK_AS_UNSUBMITTED';
  readonly type = MarkAsUnsubmittedAction.TYPE;
  readonly controlId: NgrxFormControlId;

  constructor(controlId: string) {
    this.controlId = controlId;
  }
}

export class AddControlAction<TValue, TControlKey extends keyof TValue> implements Action {
  static readonly TYPE = 'ngrx/forms/ADD_CONTROL';
  readonly type = AddControlAction.TYPE;
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

export type Actions<TValue> =
  | SetValueAction<TValue>
  | SetErrorsAction
  | MarkAsDirtyAction
  | MarkAsPristineAction
  | EnableAction
  | DisableAction
  | MarkAsTouchedAction
  | MarkAsUntouchedAction
  | FocusAction
  | UnfocusAction
  | SetLastKeyDownCodeAction
  | MarkAsSubmittedAction
  | MarkAsUnsubmittedAction
  | AddControlAction<TValue, keyof TValue>
  ;
