import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityPsychotropicNumberReportComponent } from './facility-psychotropic-number-report.component';

describe('FacilityPsychotropicNumberReportComponent', () => {
  let component: FacilityPsychotropicNumberReportComponent;
  let fixture: ComponentFixture<FacilityPsychotropicNumberReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityPsychotropicNumberReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityPsychotropicNumberReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
