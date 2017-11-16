import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncValidationComponent } from './form.component';

describe('FormComponent', () => {
  let component: SyncValidationComponent;
  let fixture: ComponentFixture<SyncValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
