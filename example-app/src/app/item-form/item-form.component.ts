import { Component, Input, Output, EventEmitter, ViewChildren, AfterViewInit, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { MdInputDirective } from '@angular/material';
import { FormGroupState, AbstractControlState } from 'ngrx-forms';

import { ItemFormValue } from './item-form.state';
import { TodoItem } from '../app.state';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent implements AfterViewInit {
  @Input() formState: FormGroupState<ItemFormValue>;
  @Output() addTodoItem = new EventEmitter<TodoItem>();

  @ViewChildren(MdInputDirective) inputs: QueryList<MdInputDirective>;

  get metaState(): FormGroupState<any> {
    return this.formState.controls.meta as FormGroupState<any>;
  }

  ngAfterViewInit() {
    const isErrorState = (state: AbstractControlState<any>) => state.isInvalid && (state.isDirty || state.isTouched || state.isSubmitted);

    // sadly, material 2 only properly integrates its error handling with @angular/forms; therefore
    // we have to implement a small hack to make error messages work
    const meta = () => this.formState.controls.meta as FormGroupState<any>;
    this.inputs.find(i => i.id === 'priority')!._isErrorState = () => isErrorState(meta().controls.priority);
    this.inputs.find(i => i.id === 'duedate')!._isErrorState = () => isErrorState(meta().controls.duedate);
    this.inputs.find(i => i.id === 'text')!._isErrorState = () => isErrorState(this.formState.controls.text);
  }

  convertDateViewValue(date: Date | null): string | null {
    return date && date.toISOString();
  }

  convertDateModelValue(value: string | null): Date | null {
    return value ? new Date(value) : null;
  }

  onSubmit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.addTodoItem.emit(this.formState.value);
  }
}
