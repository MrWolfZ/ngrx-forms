import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Action, ActionsSubject } from '@ngrx/store';
import { Actions, SetValueAction } from 'ngrx-forms';
import { Subscription } from 'rxjs';

import { GetManufacturersAction, INITIAL_LOCAL_STATE, reducer } from './local-state-advanced.reducer';

@Component({
  selector: 'ngf-local-state-advanced',
  templateUrl: './local-state-advanced.component.html',
  styleUrls: ['./local-state-advanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalStateAdvancedComponent implements OnInit, OnDestroy {
  localState = INITIAL_LOCAL_STATE;

  private subscription = new Subscription();

  constructor(private actionsSubject: ActionsSubject, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription = this.actionsSubject.subscribe(action => {
      const updated = this.updateState(action);
      if (updated) {
        // since OnPush is used, need to trigger detectChanges
        // when action from outside updates localState
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleFormAction(action: Actions<any>) {
    this.updateState(action);

    // trigger loading of new manufacturers list in effect
    if (action.type === SetValueAction.TYPE && action.controlId === this.localState.formState.controls.countryCode.id) {
      this.actionsSubject.next(new GetManufacturersAction(action.value));
    }
  }

  private updateState(action: Action): boolean {
    const localState = reducer(this.localState, action);
    const updated = localState !== this.localState;
    this.localState = localState;

    return updated;
  }
}
