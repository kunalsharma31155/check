import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityCompanyPatientNotesReportComponent } from './facility-company-patient-notes-report.component';

describe('FacilityCompanyPatientNotesReportComponent', () => {
  let component: FacilityCompanyPatientNotesReportComponent;
  let fixture: ComponentFixture<FacilityCompanyPatientNotesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityCompanyPatientNotesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityCompanyPatientNotesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
