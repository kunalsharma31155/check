import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCompanyMissingDocumentsReportsComponent } from './billing-company-missing-documents-reports.component';

describe('BillingCompanyMissingDocumentsReportsComponent', () => {
  let component: BillingCompanyMissingDocumentsReportsComponent;
  let fixture: ComponentFixture<BillingCompanyMissingDocumentsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCompanyMissingDocumentsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCompanyMissingDocumentsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
