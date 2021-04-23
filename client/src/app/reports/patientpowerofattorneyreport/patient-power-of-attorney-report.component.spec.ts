import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPowerOfAttorneyReportComponent } from './patient-power-of-attorney-report.component';

describe('PatientPowerOfAttorneyReportComponent', () => {
  let component: PatientPowerOfAttorneyReportComponent;
  let fixture: ComponentFixture<PatientPowerOfAttorneyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientPowerOfAttorneyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPowerOfAttorneyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
