import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  examples = [
    {
      path: '/simpleForm',
      hint: 'A basic form showing how to get started with ngrx-forms',
      label: 'Simple Form',
    },
    {
      path: '/simpleFormNgrx8',
      hint: 'The basic form but using action creators and simple reducers as available in ngrx 8 and above',
      label: 'Simple Form (ngrx 8+)',
    },
    {
      path: '/syncValidation',
      hint: 'How to perform synchronous validation and basic state updates',
      label: 'Synchronous Validation',
    },
    {
      path: '/asyncValidation',
      hint: 'How to perform asynchronous validation',
      label: 'Asynchronous Validation',
    },
    {
      path: '/array',
      hint: 'A form created from an array',
      label: 'Array Form',
    },
    {
      path: '/dynamic',
      hint: 'A form that supports dynamically adding and removing controls',
      label: 'Dynamic Form',
    },
    {
      path: '/valueBoxing',
      hint: 'How to use objects and arrays as form control values',
      label: 'Value Boxing',
    },
    {
      path: '/valueConversion',
      hint: 'How to convert values between the view and the state',
      label: 'Value Conversion',
    },
    {
      path: '/recursiveUpdate',
      hint: 'How to update all controls in a form at once',
      label: 'Recursive Update',
    },
    {
      path: '/material',
      hint: 'A form that uses third party form controls',
      label: 'Material UI Form',
    },
    {
      path: '/localStateIntroduction',
      hint: 'Managing form state locally in the component ',
      label: 'Local State: Introduction',
    },
    {
      path: '/localStateAdvanced',
      hint: 'Managing form state and external data locally in the component ',
      label: 'Local State: Advanced',
    },
  ];
}
