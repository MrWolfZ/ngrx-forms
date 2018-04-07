import { Component } from '@angular/core';
import { createFormControlState } from 'ngrx-forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-app',
  template: `
    <ActionBar title="My App" class="action-bar"></ActionBar>
    <input type="text" [ngrxFormControlState]="state">
  `,
})
export class AppComponent {
  // Your TypeScript logic goes here
  state = createFormControlState('test control', 'initial value');
}
