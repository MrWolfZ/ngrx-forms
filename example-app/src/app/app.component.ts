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
      label: 'Material UI Simple Form',
    },
    {
      path: '/single/default',
      hint: 'How to use a text, password or email input with ngrx-forms',
      label: 'Text Input',
    },
    {
      path: '/single/checkbox',
      hint: 'How to use a checkbox input with ngrx-forms',
      label: 'Checkbox',
    },
    {
      path: '/single/radio',
      hint: 'How to use a radio input with ngrx-forms',
      label: 'Radio',
    },
    {
      path: '/single/number',
      hint: 'How to use a number input with ngrx-forms',
      label: 'Number',
    },
    {
      path: '/single/range',
      hint: 'How to use a range input with ngrx-forms',
      label: 'Range',
    },
    {
      path: '/single/select',
      hint: 'How to use a select input with ngrx-forms',
      label: 'Select',
    },
    {
      path: '/single/selectMultiple',
      hint: 'How to use a multi-select input with ngrx-forms',
      label: 'Multi-Select',
    },
  ];
}
