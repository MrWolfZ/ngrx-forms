import { Component, Input, Output, EventEmitter, ViewChildren, AfterViewInit, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { FormGroupState, AbstractControlState, NgrxValueConverter, NgrxValueConverters } from 'ngrx-forms';

import { ItemFormValue } from './item-form.state';
import { TodoItem } from '../app.state';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent {
  @Input() formState: FormGroupState<ItemFormValue>;
  @Output() addTodoItem = new EventEmitter<TodoItem>();

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

  onSubmit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.addTodoItem.emit(this.formState.value as any);
  }
}
