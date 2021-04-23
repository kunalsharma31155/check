import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { FacilitySnapShotReportComponent } from './facility-snap-shot-report.component';



@NgModule({
  declarations: [FacilitySnapShotReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [FacilitySnapShotReportComponent],
  exports: [FacilitySnapShotReportComponent]
})
export class FacilitySnapShotReportModule { }
