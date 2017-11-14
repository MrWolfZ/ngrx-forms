import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueConversionFormComponent } from './form.component';

describe(ValueConversionFormComponent.name, () => {
  let component: ValueConversionFormComponent;
  let fixture: ComponentFixture<ValueConversionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueConversionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueConversionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
