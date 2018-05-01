
import { Directive, Host, OnDestroy } from '@angular/core';
import { MatListOption } from '@angular/material/list';

/**
 * This directive fixes an issue with the selection list component
 * which causes the form state to lose all values when the selection
 * list component leaves the DOM. The reason for that is that the
 * list options de-register themselves when being destroyed which
 * forces the list to update its value (which then does not contain
 * the removed option anymore). This behaviour usually makes sense
 * but as a side-effect it also resets the value of the list when the
 * list itself is destroyed since all its child options are destroyed
 * first. This directive is a workaround for that by preventing the
 * option from reporting the value change after it is destroyed. This
 * only works because reporting the value change is deferred inside
 * the ngOnDestroy function of the MatListOption which allows us to
 * run the code below in between the option being destroyed and it
 * trying to report the value change to its parent list (this has been
 * observed up until v5.2.5 of @angular/material, therefore there is
 * no guarantee that this workaround will continue to work).
 */
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
