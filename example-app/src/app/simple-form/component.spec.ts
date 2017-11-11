import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormPageComponent } from './component';

describe(SimpleFormPageComponent.name, () => {
  let component: SimpleFormPageComponent;
  let fixture: ComponentFixture<SimpleFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleFormPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
