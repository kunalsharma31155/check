import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

import { FacilityDetailedGdrReportComponent } from './facility-detailed-gdr-report.component';

@NgModule({
  declarations: [FacilityDetailedGdrReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule,
    FormsModule
  ],
  entryComponents: [FacilityDetailedGdrReportComponent],
  exports: [FacilityDetailedGdrReportComponent]
})
export class FacilityDetailedGdrReportModule { }
