import { Component, Input, Output, EventEmitter, ViewChildren, AfterViewInit, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { MdInputDirective } from '@angular/material';
import { FormGroupState, AbstractControlState, NgrxValueConverter, NgrxValueConverters } from 'ngrx-forms';

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

  dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
    convertViewToStateValue(value) {
      if (value === null) {
        return null;
      }

      // the value provided by the date picker is in local time but we want UTC so we recreate the date as UTC
      value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
      return NgrxValueConverters.dateToISOString.convertViewToStateValue(value);
    },
    convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
  };

  ngAfterViewInit() {
    const isErrorState = (state: AbstractControlState<any>) => state.isInvalid && (state.isDirty || state.isTouched || state.isSubmitted);

    // sadly, material 2 only properly integrates its error handling with @angular/forms; therefore
    // we have to implement a small hack to make error messages work
    const meta = () => this.formState.controls.meta as FormGroupState<any>;
    this.inputs.find(i => i.id === 'priority')!._isErrorState = () => isErrorState(meta().controls.priority);
    this.inputs.find(i => i.id === 'duedate')!._isErrorState = () => isErrorState(meta().controls.duedate);
    this.inputs.find(i => i.id === 'text')!._isErrorState = () => isErrorState(this.formState.controls.text);
  }

  onSubmit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.addTodoItem.emit(this.formState.value as any);
  }
}
