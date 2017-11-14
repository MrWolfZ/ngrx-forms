import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayFormComponent } from './form.component';

describe(ArrayFormComponent.name, () => {
  let component: ArrayFormComponent;
  let fixture: ComponentFixture<ArrayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
