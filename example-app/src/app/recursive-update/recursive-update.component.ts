import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './recursive-update.reducer';

@Component({
  selector: 'ngf-recursive-update',
  templateUrl: './recursive-update.component.html',
  styleUrls: ['./recursive-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecursiveUpdatePageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action, combineReducers } from '@ngrx/store';
import {
  createFormGroupState,
  disable,
  enable,
  formGroupReducer,
  FormGroupState,
  setUserDefinedProperty,
  updateGroup,
  updateRecursive,
} from 'ngrx-forms';

export interface FormValue {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  favoriteColor: string;
  employed: boolean;
  notes: string;
}

export class BlockUIAction implements Action {
  static TYPE = 'recursiveUpdate/BLOCK_UI';
  type = BlockUIAction.TYPE;
}

export class UnblockUIAction implements Action {
  static TYPE = 'dynamic/UNBLOCK_UI';
  type = UnblockUIAction.TYPE;
}

export const FORM_ID = 'recursiveUpdate';

export const INITIAL_STATE = updateGroup<FormValue>(
  createFormGroupState<FormValue>(FORM_ID, {
    firstName: '',
    lastName: '',
    email: '',
    sex: '',
    favoriteColor: '',
    employed: false,
    notes: '',
  }),
  {
    employed: disable,
    notes: disable,
    sex: disable,
  });

export const reducers = {
  formState(
    state: FormGroupState<FormValue> = INITIAL_STATE,
    a: BlockUIAction | UnblockUIAction,
  ) {
    state = formGroupReducer(state, a);

    switch (a.type) {
      case BlockUIAction.TYPE: {
        state = updateRecursive(
          state,
          s => setUserDefinedProperty(s, 'wasDisabled', s.isDisabled),
        );
        return disable(state);
      }

      case UnblockUIAction.TYPE: {
        state = enable(state);
        return updateRecursive(
          state,
          s => s.userDefinedProperties.wasDisabled ? disable(s) : s,
        );
      }

      default: {
        return state;
      }
    }
  },
};
  `;

  componentCode = `
import { Observable } from 'rxjs/Observable';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction } from 'ngrx-forms';

import {
  FormValue,
  INITIAL_STATE,
  BlockUIAction,
  UnblockUIAction,
} from '../recursive-update.reducer';

@Component({
  selector: 'ngf-recursive-update-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecursiveUpdateFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    this.actionsSubject.next(new BlockUIAction());
    Observable.timer(1000)
      .map(() => new UnblockUIAction())
      .subscribe(this.actionsSubject);
  }
}
  `;

  componentHtml = `
<form [ngrxFormState]="formState"
      (submit)="submit()">
  <div>
    <label>First Name</label>
    <div>
      <input type="text"
             placeholder="First Name"
             [ngrxFormControlState]="formState.controls.firstName" />
    </div>
  </div>
  <div>
    <label>Last Name</label>
    <div>
      <input type="text"
             placeholder="Last Name"
             [ngrxFormControlState]="formState.controls.lastName" />
    </div>
  </div>
  <div>
    <label>Email</label>
    <div>
      <input type="email"
             placeholder="Email"
             [ngrxFormControlState]="formState.controls.email" />
    </div>
  </div>
  <div>
    <label>Sex</label>
    <div>
      <label>
        <input type="radio"
               value="male"
               [ngrxFormControlState]="formState.controls.sex" /> Male
      </label>
      <label>
        <input type="radio"
               value="female"
               [ngrxFormControlState]="formState.controls.sex" /> Female
      </label>
    </div>
  </div>
  <div>
    <label>Favorite Color</label>
    <div>
      <select [ngrxFormControlState]="formState.controls.favoriteColor">
        <option value=""></option>
        <option value="ff0000">Red</option>
        <option value="00ff00">Green</option>
        <option value="0000ff">Blue</option>
      </select>
    </div>
  </div>
  <div>
    <label>Employed</label>
    <div>
      <input type="checkbox"
             [ngrxFormControlState]="formState.controls.employed" />
    </div>
  </div>
  <div>
    <label>Notes</label>
    <div>
      <textarea [ngrxFormControlState]="formState.controls.notes">
      </textarea>
    </div>
  </div>
  <div class="buttons">
    <div></div>
    <div>
      <button type="submit">
        Submit
      </button>
    </div>
  </div>
</form>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.recursiveUpdate.formState);
  }
}
