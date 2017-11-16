import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveUpdateFormComponent } from './form.component';

describe(RecursiveUpdateFormComponent.name, () => {
  let component: RecursiveUpdateFormComponent;
  let fixture: ComponentFixture<RecursiveUpdateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecursiveUpdateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
