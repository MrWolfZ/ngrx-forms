import { Action } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { count, take } from 'rxjs/operators';

import { MarkAsSubmittedAction } from '../actions';
import { createFormGroupState } from '../state';
import { NgrxLocalFormDirective } from './local-state-directive';

describe(NgrxLocalFormDirective.name, () => {
  let directive: NgrxLocalFormDirective<{}>;
  let actionsSubject: ReplaySubject<Action>;
  let actions$: Observable<Action>;
  const FORM_GROUP_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = {};
  const INITIAL_STATE = createFormGroupState<{}>(FORM_GROUP_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new ReplaySubject<Action>();
    actions$ = actionsSubject;
    directive = new NgrxLocalFormDirective<{}>();
    directive.state = INITIAL_STATE;
    directive.ngOnInit();
  });

  describe('local action emit', () => {
    it(`should not dispatch a ${MarkAsSubmittedAction.name} to the global store if the form is submitted and the state is unsubmitted`, done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      directive.onSubmit({ preventDefault: () => void 0 } as any);
      actionsSubject.complete();
    });

    it(`should dispatch a ${MarkAsSubmittedAction.name} to the event emitter if the form is submitted and the state is unsubmitted`, done => {
      directive.ngrxFormsAction.pipe(take(1)).subscribe(a => {
        expect(a).toEqual(new MarkAsSubmittedAction(INITIAL_STATE.id));
        done();
      });

      directive.onSubmit({ preventDefault: () => void 0 } as any);
    });

    it(`should not dispatch a ${MarkAsSubmittedAction.name} to the global store if the form is submitted and the state is submitted`, done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      directive.state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      directive.onSubmit({ preventDefault: () => void 0 } as any);
      actionsSubject.complete();
    });

    it(`should not dispatch a ${MarkAsSubmittedAction.name} to the event emitter if the form is submitted and the state is submitted`, done => {
      directive.ngrxFormsAction.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      directive.state = { ...INITIAL_STATE, isSubmitted: true, isUnsubmitted: false };
      directive.onSubmit({ preventDefault: () => void 0 } as any);
      directive.ngrxFormsAction.complete();
    });
  });
});
