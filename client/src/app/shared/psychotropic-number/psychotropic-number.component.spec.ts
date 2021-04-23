import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychotropicNumberComponent } from './psychotropic-number.component';

describe('PsychotropicNumberComponent', () => {
  let component: PsychotropicNumberComponent;
  let fixture: ComponentFixture<PsychotropicNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsychotropicNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychotropicNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
