import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { AdminPriorAuthReportComponent } from './admin-prior-auth-report.component';



@NgModule({
  declarations: [AdminPriorAuthReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [AdminPriorAuthReportComponent],
  exports: [
    AdminPriorAuthReportComponent
  ]
})
export class AdminPriorAuthReportModule { }
