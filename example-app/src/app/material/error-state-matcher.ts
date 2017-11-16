import { Directive, Host, Optional } from '@angular/core';
import { Input } from '@angular/core';
import { MatInput, MatSelect } from '@angular/material';
import { FormControlState } from 'ngrx-forms';

@Directive({
  selector: '[ngrxFormControlState]',
})
export class CustomErrorStateMatcherDirective {
  @Input() set ngrxFormControlState(state: FormControlState<any>) {
    const errorsAreShown = state.isInvalid && (state.isTouched || state.isSubmitted);

    if (this.input) {
      this.input.errorState = errorsAreShown;
      this.input.stateChanges.next();
    }

    if (this.select) {
      this.select.errorState = errorsAreShown;
      this.select.stateChanges.next();
    }
  }

  constructor(
    @Host() @Optional() private input: MatInput,
    @Host() @Optional() private select: MatSelect,
  ) { }
}
