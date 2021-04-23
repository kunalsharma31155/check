import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefProviderPerformanceReportComponent } from './brief-provider-performance-report.component';

describe('BriefProviderPerformanceReportComponent', () => {
  let component: BriefProviderPerformanceReportComponent;
  let fixture: ComponentFixture<BriefProviderPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefProviderPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefProviderPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
