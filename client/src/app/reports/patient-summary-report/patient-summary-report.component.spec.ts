import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSummaryReportComponent } from './patient-summary-report.component';

describe('PatientSummaryReportComponent', () => {
  let component: PatientSummaryReportComponent;
  let fixture: ComponentFixture<PatientSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
