import { Action, ActionsSubject } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { count, take } from 'rxjs/operators';

import { MarkAsSubmittedAction } from '../actions';
import { createFormGroupState } from '../state';
import { NgrxFormDirective } from './directive';

describe(NgrxFormDirective.name, () => {
  let directive: NgrxFormDirective<{}>;
  let actionsSubject: ReplaySubject<Action>;
  let actions$: Observable<Action>;
  const FORM_GROUP_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = {};
  const INITIAL_STATE = createFormGroupState<{}>(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new ReplaySubject<Action>();
    actions$ = actionsSubject;
    directive = new NgrxFormDirective<{}>(actionsSubject as any);
    directive.state = INITIAL_STATE;
    directive.ngOnInit();
  });

  it('should throw if state is not set when component is initialized', () => {
    directive = new NgrxFormDirective<{}>(actionsSubject as any);
    expect(() => directive.ngOnInit()).toThrowError();
  });

  it('should throw while trying to emit actions if no ActionsSubject was provided', () => {
    directive = new NgrxFormDirective<{}>(null as any as ActionsSubject);
    directive.state = INITIAL_STATE;
    directive.ngOnInit();
    expect(() => directive.onSubmit({ preventDefault: () => void 0 } as any)).toThrowError();
  });

  it(`should dispatch a ${MarkAsSubmittedAction.name} if the form is submitted and the state is unsubmitted`, done => {
    actions$.pipe(take(1)).subscribe(a => {
      expect(a).toEqual(new MarkAsSubmittedAction(INITIAL_STATE.id));
      done();
    });

    directive.onSubmit({ preventDefault: () => void 0 } as any);
  });

  it(`should not dispatch a ${MarkAsSubmittedAction.name} if the form is submitted and the state is submitted`, done => {
    actions$.pipe(count()).subscribe(c => {
      expect(c).toEqual(0);
      done();
    });

    directive.state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
    directive.onSubmit({ preventDefault: () => void 0 } as any);
    actionsSubject.complete();
  });
});
