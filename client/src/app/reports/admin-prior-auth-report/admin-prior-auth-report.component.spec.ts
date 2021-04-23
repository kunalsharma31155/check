import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPriorAuthReportComponent } from './admin-prior-auth-report.component';

describe('AdminPriorAuthReportComponent', () => {
  let component: AdminPriorAuthReportComponent;
  let fixture: ComponentFixture<AdminPriorAuthReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPriorAuthReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPriorAuthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
