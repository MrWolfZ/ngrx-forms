import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './dynamic.reducer';

@Component({
  selector: 'ngf-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  arrayOptions$: Observable<number[]>;
  groupOptions$: Observable<string[]>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  AddArrayControlAction,
  addGroupControl,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  RemoveArrayControlAction,
  setValue,
  updateGroup,
} from 'ngrx-forms';

export interface FormValue {
  array: boolean[];
  group: { [id: string]: boolean };
}

export class CreateGroupElementAction implements Action {
  static TYPE = 'dynamic/CREATE_GROUP_ELEMENT';
  type = CreateGroupElementAction.TYPE;
  constructor(public name: string) { }
}

export class RemoveGroupElementAction implements Action {
  static TYPE = 'dynamic/REMOVE_GROUP_ELEMENT';
  type = RemoveGroupElementAction.TYPE;
  constructor(public name: string) { }
}

export const FORM_ID = 'dynamic';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  array: [false, false],
  group: {
    abc: false,
    xyz: false,
  },
});

export const reducers = {
  formState(
    s = INITIAL_STATE,
    a: CreateGroupElementAction | RemoveGroupElementAction,
  ) {
    s = formGroupReducer(s, a);

    switch (a.type) {
      case CreateGroupElementAction.TYPE:
        return updateGroup<FormValue>({
          group: group => {
            const newGroup =
              addGroupControl(group, a.name, false);

            // alternatively we can also use setValue
            // const newValue = { ...group.value, [a.name]: false };
            // const newGroup = setValue(group, newValue);

            return newGroup;
          },
        })(s);

      case RemoveGroupElementAction.TYPE:
        return updateGroup<FormValue>({
          group: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            const newGroup = setValue(group, newValue);

            // alternatively we can also use removeGroupControl
            // const newGroup = removeGroupControl(group, a.name);

            return newGroup;
          },
        })(s);

      default:
        return s;
    }
  },
  array(
    s = { maxIndex: 2, options: [1, 2] },
    a: AddArrayControlAction<boolean> | RemoveArrayControlAction,
  ) {
    switch (a.type) {
      case AddArrayControlAction.TYPE: {
        const maxIndex = s.maxIndex + 1;
        const options = [...s.options];
        options.splice(a.payload.index!, 0, maxIndex);
        return {
          maxIndex,
          options,
        };
      }

      case RemoveArrayControlAction.TYPE: {
        const options = [...s.options];
        options.splice(a.payload.index!, 1);
        return {
          ...s,
          options,
        };
      }

      default:
        return s;
    }
  },
  groupOptions(
    s = ['abc', 'xyz'],
    a: CreateGroupElementAction | RemoveGroupElementAction,
  ) {
    switch (a.type) {
      case CreateGroupElementAction.TYPE:
        return [...s, a.name];

      case RemoveGroupElementAction.TYPE:
        return s.filter(i => i !== a.name);

      default:
        return s;
    }
  },
};
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import {
  ddArrayControlAction,
  FormGroupState,
  RemoveArrayControlAction,
} from 'ngrx-forms';

import {
  CreateGroupElementAction,
  FormValue,
  RemoveGroupElementAction,
} from '../dynamic.reducer';

@Component({
  selector: 'ngf-dynamic-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  @Input() arrayOptions: number[];
  @Input() groupOptions: string[];

  constructor(private actionsSubject: ActionsSubject) { }

  addGroupOption() {
    const name = Math.random().toString(36).substr(2, 3);
    this.actionsSubject.next(new CreateGroupElementAction(name));
  }

  removeGroupOption(name: string) {
    this.actionsSubject.next(new RemoveGroupElementAction(name));
  }

  addArrayOption(index: number) {
    this.actionsSubject.next(new AddArrayControlAction(
      this.formState.controls.array.id,
      false,
      index,
    ));
  }

  removeArrayOption(index: number) {
    this.actionsSubject.next(new RemoveArrayControlAction(
      this.formState.controls.array.id,
      index,
    ));
  }

  trackByIndex(index: number) {
    return index;
  }

  trackById(index: number, id: string) {
    return id;
  }
}
  `;

  componentHtml = `
<form>
  <div>
    <span class="section-heading">Array options:</span>
    <button (click)="addArrayOption(0)"
            type="button"
            class="add-btn">
      +
    </button>
    <div *ngFor="let o of arrayOptions;
               trackBy: trackByIndex;
               let i = index"
         class="array-option">
      <div>
        <label>Option {{ o }}</label>
        <div>
          <input type="checkbox"
                 [ngrxFormControlState]="formState.controls.array.controls[i]" />
        </div>
        <button (click)="removeArrayOption(i)"
                type="button"
                class="remove-btn">
          -
        </button>
      </div>
      <button (click)="addArrayOption(i + 1)"
              type="button"
              class="add-btn">
        +
      </button>
    </div>
  </div>
  <div>
    <span class="section-heading">Group options:</span>
    <div *ngFor="let o of groupOptions; trackBy: trackById"
         class="group-option">
      <div>
        <label>Option {{ o }}</label>
        <div>
          <input type="checkbox"
                 [ngrxFormControlState]="formState.controls.group.controls[o]" />
        </div>
        <button (click)="removeGroupOption(o)"
                type="button"
                class="remove-btn">
          -
        </button>
      </div>
    </div>
    <button (click)="addGroupOption()"
            type="button"
            class="add-btn">
      +
    </button>
  </div>
</form>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.dynamic.formState);
    this.arrayOptions$ = store.select(s => s.dynamic.array.options);
    this.groupOptions$ = store.select(s => s.dynamic.groupOptions);
  }
}
