import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionPageComponent } from './component';

describe(IntroductionPageComponent.name, () => {
  let component: IntroductionPageComponent;
  let fixture: ComponentFixture<IntroductionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntroductionPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroductionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
