import { Component } from '@angular/core';

import { INITIAL_FORM_STATE, reducer } from './local-state-introduction.reducer';
import {NgrxFormActionTypes} from "../../../../src/actions";

@Component({
  selector: 'ngf-local-state-introduction',
  templateUrl: './local-state-introduction.component.html',
  styleUrls: ['./local-state-introduction.component.scss'],
})
export class LocalStateIntroductionComponent {
  formState = INITIAL_FORM_STATE;

  handleFormAction(action: NgrxFormActionTypes) {
    this.formState = reducer(this.formState, action);
  }
}
