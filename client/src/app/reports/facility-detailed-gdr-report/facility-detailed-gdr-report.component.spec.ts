import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityDetailedGdrReportComponent } from './facility-detailed-gdr-report.component';

describe('FacilityDetailedGdrReportComponent', () => {
  let component: FacilityDetailedGdrReportComponent;
  let fixture: ComponentFixture<FacilityDetailedGdrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityDetailedGdrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDetailedGdrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
