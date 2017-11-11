import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

@Component({
  selector: 'ngf-form-example',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormExampleComponent {
  @Input() set reducerCode(value: string) {
    this.formattedReducerCode = Prism.highlight(value.trim(), Prism.languages.typescript);
  }

  @Input() set componentCode(value: string) {
    this.formattedComponentCode = Prism.highlight(value.trim(), Prism.languages.typescript);
  }

  @Input() set componentHtml(value: string) {
    this.formattedComponentHtml = Prism.highlight(value.trim(), Prism.languages.html);
  }

  @Input() set formState(value: FormGroupState<any>) {
    const formStateJson = JSON.stringify(value, null, 2);
    this.formattedFormState = Prism.highlight(formStateJson, Prism.languages.json);
  }

  formattedReducerCode: string;
  formattedComponentCode: string;
  formattedComponentHtml: string;
  formattedFormState: string;
}
