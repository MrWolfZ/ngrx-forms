import {
  Directive,
  ElementRef,
  Input,
  Inject,
  HostListener,
  HostBinding,
  OnInit,
  OnDestroy,
  Self,
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

import {
  SetValueAction,
  MarkAsTouchedAction,
  FocusAction,
  UnfocusAction,
  SetLastKeyDownCodeAction,
} from '../actions';
import { FormControlState, FormControlValueTypes } from '../state';
import { selectValueAccessor } from '../value-accessors';

@Directive({
  selector: '[ngrxFormControlState]',
})
export class NgrxFormControlDirective<TValue extends FormControlValueTypes> implements OnInit, OnDestroy {
  @Input() set ngrxFormControlState(newState: FormControlState<TValue>) {
    this.state = newState;
    this.stateSubject$.next(newState);
  }

  // automatically apply the attribute that's used by the CDK to set initial focus
  @HostBinding('attr.cdk-focus-region-start') get focusRegionStartAttr() {
    return this.state && this.state.isFocused ? '' : null;
  }

  private subscriptions: Subscription[] = [];

  private state: FormControlState<TValue>;
  private stateSubject$ = new BehaviorSubject<FormControlState<TValue>>(this.state);
  private valueAccessor: ControlValueAccessor;

  // the <any> cast is required due to a mismatch in the typing of lift() between Observable and BehaviorSubject
  private get state$(): Observable<FormControlState<TValue>> { return this.stateSubject$ as any; }

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private dom: Document,
    private actionsSubject: ActionsSubject,
    @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
  ) {
    this.valueAccessor = selectValueAccessor(valueAccessors);
  }

  @Input() convertViewValue: (value: any) => TValue = value => value;
  @Input() convertModelValue: (value: TValue) => any = value => value;

  ngOnInit() {
    this.valueAccessor.registerOnChange((newValue: any) => {
      newValue = this.convertViewValue(newValue);
      if (newValue !== this.state.value) {
        this.actionsSubject.next(new SetValueAction(this.state.id, newValue));
      }
    });

    this.valueAccessor.registerOnTouched(() => {
      if (!this.state.isTouched) {
        this.actionsSubject.next(new MarkAsTouchedAction(this.state.id));
      }
    });

    this.subscriptions.push(
      this.state$
        .map(s => s.value)
        .map(this.convertModelValue)
        .subscribe(value => this.valueAccessor.writeValue(value))
    );

    if (this.valueAccessor.setDisabledState) {
      this.subscriptions.push(
        this.state$
          .map(s => s.isDisabled)
          .subscribe(isDisabled => this.valueAccessor.setDisabledState!(isDisabled))
      );
    }

    this.subscriptions.push(
      this.state$
        .map(s => s.isFocused)
        .distinctUntilChanged()
        .subscribe(isFocused => {
          if (isFocused) {
            this.el.nativeElement.focus();
          } else {
            this.el.nativeElement.blur();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('focusin')
  @HostListener('focusout')
  onFocusChange() {
    if (!this.state) {
      return;
    }

    const isControlFocused = this.el.nativeElement === this.dom.activeElement;
    if (isControlFocused !== this.state.isFocused) {
      this.actionsSubject.next(isControlFocused ? new FocusAction(this.state.id) : new UnfocusAction(this.state.id));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.state) {
      return;
    }

    if (event.keyCode !== this.state.lastKeyDownCode) {
      this.actionsSubject.next(new SetLastKeyDownCodeAction(this.state.id, event.keyCode));
    }
  }
}
