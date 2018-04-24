
import { Directive, Host, OnDestroy } from '@angular/core';
import { MatListOption } from '@angular/material/list';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'mat-list-option',
})
export class MatListOptionFixDirective implements OnDestroy {
  constructor(@Host() private matDirective: MatListOption) { }

  ngOnDestroy() {
    this.matDirective.selectionList = { _reportValueChange: () => void 0 } as any;
  }
}
