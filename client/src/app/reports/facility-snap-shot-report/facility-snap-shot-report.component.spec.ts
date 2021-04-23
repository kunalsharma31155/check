import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySnapShotReportComponent } from './facility-snap-shot-report.component';

describe('FacilitySnapShotReportComponent', () => {
  let component: FacilitySnapShotReportComponent;
  let fixture: ComponentFixture<FacilitySnapShotReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitySnapShotReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitySnapShotReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
