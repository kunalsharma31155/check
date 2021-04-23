import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { BriefProviderPerformanceReportComponent } from './brief-provider-performance-report.component';



@NgModule({
  declarations: [BriefProviderPerformanceReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [BriefProviderPerformanceReportComponent],
  exports: [
    BriefProviderPerformanceReportComponent
  ]
})
export class BriefProviderPerformanceReportModule { }
