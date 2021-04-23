import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityPracticePerformanceReportComponent } from './facility-practice-performance-report.component';

describe('FacilityPracticePerformanceReportComponent', () => {
  let component: FacilityPracticePerformanceReportComponent;
  let fixture: ComponentFixture<FacilityPracticePerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityPracticePerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityPracticePerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
