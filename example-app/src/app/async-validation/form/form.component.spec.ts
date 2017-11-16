import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncValidationFormComponent } from './form.component';

describe(AsyncValidationFormComponent.name, () => {
  let component: AsyncValidationFormComponent;
  let fixture: ComponentFixture<AsyncValidationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsyncValidationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncValidationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
