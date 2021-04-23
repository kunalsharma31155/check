import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityPostRoundingReportComponent } from './facility-post-round-report.component';

describe('FacilityPostRoundingReportComponent', () => {
  let component: FacilityPostRoundingReportComponent;
  let fixture: ComponentFixture<FacilityPostRoundingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityPostRoundingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityPostRoundingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
