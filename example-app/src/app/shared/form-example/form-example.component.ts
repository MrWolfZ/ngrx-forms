import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

export enum KEY_CODE {
  A = 65,
}

@Component({
  selector: 'ngf-form-example',
  templateUrl: './form-example.component.html',
  styleUrls: ['./form-example.component.scss'],
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

  @Input() set effectsCode(value: string) {
    this.formattedEffectsCode = Prism.highlight(value.trim(), Prism.languages.typescript);
  }

  @Input() set formState(value: FormGroupState<any>) {
    const formStateJson = JSON.stringify(value, null, 2);
    this.formattedFormState = Prism.highlight(formStateJson, Prism.languages.json);
  }

  formattedReducerCode: string;
  formattedComponentCode: string;
  formattedComponentHtml: string;
  formattedEffectsCode: string;
  formattedFormState: string;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.A && event.ctrlKey) {
      const preEl = document.querySelector('pre:hover');
      if (preEl) {
        selectText(preEl);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
}

function selectText(element: Element) {
  const body = document.body as any;
  if (body.createTextRange) {
    const range = body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
