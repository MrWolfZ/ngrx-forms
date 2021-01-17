import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

@Component({
  selector: 'ngf-form-example',
  templateUrl: './form-example.component.html',
  styleUrls: ['./form-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormExampleComponent {
  @Input() exampleName = '';
  @Input() githubLinkOverride: string | undefined;

  @Input() set formState(value: FormGroupState<any>) {
    const formStateJson = JSON.stringify(value, null, 2);
    this.formattedFormState = Prism.highlight(formStateJson, Prism.languages.json, 'en');
  }

  formattedFormState = '';

  get githubLink() {
    return this.githubLinkOverride || this.exampleName.replace(' ', '-').toLowerCase();
  }
}
