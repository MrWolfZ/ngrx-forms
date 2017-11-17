import {AfterViewInit, Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormControlState} from 'ngrx-forms';
import {MatFormFieldControl} from '@angular/material/form-field';


// Sadly, material 2 only properly integrates its error handling with @angular/forms;
// therefore, we have to add the errorState field to all field controls.
@Directive({
  selector: '[ngrxFormControlState]',
})
export class NgrxValidateMatFormFieldControl implements OnChanges {

  @Input() ngrxFormControlState: FormControlState<any>;

  constructor(private input: MatFormFieldControl<any>) {
  }

  ngOnChanges(changes: SimpleChanges): void {    
    const isErrorState = () => this.ngrxFormControlState.isInvalid &&
      (this.ngrxFormControlState.isDirty
        || this.ngrxFormControlState.isTouched
        || this.ngrxFormControlState.isSubmitted);
    (this.input as any).errorState = isErrorState();
  }

}

