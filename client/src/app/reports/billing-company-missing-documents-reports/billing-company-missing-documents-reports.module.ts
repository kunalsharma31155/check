import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { BillingCompanyMissingDocumentsReportsComponent } from './billing-company-missing-documents-reports.component';



@NgModule({
  declarations: [BillingCompanyMissingDocumentsReportsComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [BillingCompanyMissingDocumentsReportsComponent],
  exports: [BillingCompanyMissingDocumentsReportsComponent]
})
export class BillingCompanyMissingDocumentsReportsModule { }
